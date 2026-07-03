// Use local dev server when running on localhost, otherwise production
const API_BASE_URL = window.location.hostname === 'localhost'
    ? `http://localhost:3001/api`
    : 'https://ov-public-api-gamma.vercel.app/api';

// Map variables
let map, marker, circle;
let currentLat = 52.3676; // Amsterdam default
let currentLng = 4.9041;
let currentRadius = 0.5; // 500m in km
let searchTimeout;
let filteredLines = new Set(); // Set of filtered line numbers
let allDeparturesData = null; // Store the original data
const lineLayersMap = new Map();  // `${lineNr}|${agency}` → L.LayerGroup (polyline + stop markers)
const lineDataCache = new Map();  // `${lineNr}|${agency}` → stops object (persists across filter changes)
let stopMarkersLayer = null;      // TRAIN station markers only

// Utility functions to eliminate duplication
function processStationArray(stations) {
    let stationArray = [];
    if (Array.isArray(stations)) {
        stationArray = stations;
    } else if (stations && typeof stations === 'object') {
        if (stations.Station_Info) {
            stationArray = [stations];
        } else {
            stationArray = Object.values(stations).filter(item =>
                item && typeof item === 'object' && item.Station_Info
            );
        }
    }
    return stationArray;
}

function getTransportClass(transportType, prefix = 'transport-') {
    const type = transportType?.toLowerCase() || '';
    if (type.includes('tram')) return `${prefix}tram`;
    if (type.includes('bus')) return `${prefix}bus`;
    if (type.includes('train')) return `${prefix}train`;
    if (type.includes('metro')) return `${prefix}metro`;
    return `${prefix}bus`;
}

function getTimeStatus(planned, expected) {
    const timeDiff = getTimeDifference(planned, expected);
    const isDelayed = timeDiff > 2;
    const isEarly = timeDiff < -2;

    return {
        timeDiff,
        isDelayed,
        isEarly,
        statusText: isDelayed ? 'Delayed' : isEarly ? 'Early' : 'On Time',
        statusClass: isDelayed ? 'status-delayed' : isEarly ? 'status-early' : 'status-driving'
    };
}

function isTrainDeparture(departure) {
    return departure.TransportTypeCode !== undefined || departure.LineNumber === undefined;
}

function getTrainTimeStatus(planned, delayMinutes) {
    const delay = delayMinutes || 0;
    const isDelayed = delay > 2;
    return {
        timeDiff: delay,
        isDelayed,
        isEarly: false,
        statusText: isDelayed ? `+${delay} min` : 'On Time',
        statusClass: isDelayed ? 'status-delayed' : 'status-driving',
    };
}

function formatTrainTimeDisplay(planned, delayMinutes) {
    const delay = delayMinutes || 0;
    if (delay <= 2) {
        return `<span class="expected-time">${formatTime(planned)}</span>`;
    }
    const expectedMs = new Date(planned).getTime() + delay * 60000;
    const expectedTime = formatTime(new Date(expectedMs).toISOString());
    return `
        <span class="planned-time strikethrough">${formatTime(planned)}</span>
        <span class="expected-time delayed">${expectedTime} (+${delay})</span>
    `;
}

function updateLocationAndSearch(lat, lng, zoom = 15, showFallbackMessage = false) {
    currentLat = lat;
    currentLng = lng;
    marker.setLatLng([currentLat, currentLng]);
    map.setView([currentLat, currentLng], zoom);
    updateCircle();
    
    if (showFallbackMessage) {
        showResult('Using Amsterdam as default location. Click the 📍 button to use your current location.', 'loading');
    }
    
    triggerSearch();
}

function handleGeolocation(successCallback, errorCallback, options = {}) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            successCallback,
            errorCallback,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
                ...options
            }
        );
    } else {
        errorCallback({ message: 'Geolocation not supported' });
    }
}

// Custom control for "Go to My Location" button
L.Control.LocationButton = L.Control.extend({
    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('a', 'location-button', container);

        button.innerHTML = '📍';
        button.title = 'Go to My Location';
        button.style.cssText = `
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 16px;
            background: white;
            border: 2px solid rgba(0,0,0,0.2);
            border-radius: 4px;
            cursor: pointer;
            display: block;
            text-decoration: none;
            color: #333;
            transition: all 0.2s ease;
        `;

        button.onmouseover = function () {
            this.style.background = '#f8f9fa';
            this.style.borderColor = 'rgba(0,0,0,0.3)';
        };

        button.onmouseout = function () {
            this.style.background = 'white';
            this.style.borderColor = 'rgba(0,0,0,0.2)';
        };

        button.onclick = function (e) {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            useCurrentLocation();
        };

        return container;
    }
});

// Custom control for radius slider
L.Control.RadiusSlider = L.Control.extend({
    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control radius-control-container');

        container.style.cssText = `
            background: white;
            border: 2px solid rgba(0,0,0,0.2);
            border-radius: 4px;
            padding: 8px;
            margin-top: 5px;
            min-width: 120px;
        `;

        // Prevent map clicks when interacting with the control
        container.onclick = function (e) {
            L.DomEvent.stopPropagation(e);
        };

        const label = L.DomUtil.create('div', 'radius-label', container);
        label.innerHTML = 'Radius: <span id="radius-value-inline">500</span>m';
        label.style.cssText = `
            font-size: 11px;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
            text-align: center;
        `;

        const slider = L.DomUtil.create('input', 'radius-slider', container);
        slider.type = 'range';
        slider.min = '100';
        slider.max = '500';
        slider.step = '50';
        slider.value = '500';
        slider.style.cssText = `
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: #ddd;
            outline: none;
            cursor: pointer;
        `;

        slider.oninput = function () {
            const radiusMeters = parseFloat(this.value);
            currentRadius = radiusMeters / 1000; // Convert meters to km for API

            console.log('Radius changed:', radiusMeters + 'm =', currentRadius + 'km');

            document.getElementById('radius-value-inline').textContent = radiusMeters;

            // Update the circle on the map
            circle.setRadius(radiusMeters);

            // Immediate search for radius changes (no debounce)
            showResult('Searching for departures...', 'loading');
            fetchDeparturesByGeo(currentLat, currentLng, currentRadius);
        };

        // Prevent map clicks when interacting with the slider
        slider.onclick = function (e) {
            L.DomEvent.stopPropagation(e);
        };

        slider.onmousedown = function (e) {
            L.DomEvent.stopPropagation(e);
        };

        return container;
    }
});

L.control.locationButton = function (opts) {
    return new L.Control.LocationButton(opts);
};

L.control.radiusSlider = function (opts) {
    return new L.Control.RadiusSlider(opts);
};

// Initialize map
function initMap() {
    map = L.map('map').setView([currentLat, currentLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker
    marker = L.marker([currentLat, currentLng], {
        draggable: true
    }).addTo(map);

    // Add circle for search radius
    circle = L.circle([currentLat, currentLng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.2,
        radius: currentRadius * 1000 // Convert km to meters
    }).addTo(map);

    // Layer group for stop markers
    stopMarkersLayer = L.layerGroup().addTo(map);

    // Add custom controls
    L.control.locationButton({ position: 'topleft' }).addTo(map);
    L.control.radiusSlider({ position: 'bottomleft' }).addTo(map);

    // Update coordinates when marker is dragged
    marker.on('dragend', function (event) {
        const position = event.target.getLatLng();
        updateLocationAndSearch(position.lat, position.lng);
    });

    // Update coordinates when map is clicked
    map.on('click', function (event) {
        const position = event.latlng;
        updateLocationAndSearch(position.lat, position.lng);
    });

    updateCircle();

    // Try to get current location first, fallback to Amsterdam
    getCurrentLocationWithFallback();
}

function getCurrentLocationWithFallback() {
    handleGeolocation(
        function (position) {
            updateLocationAndSearch(position.coords.latitude, position.coords.longitude, 15);
        },
        function (error) {
            console.log('Geolocation failed, using Amsterdam as default:', error.message);
            updateLocationAndSearch(52.3676, 4.9041, 13, true);
        }
    );
}

function updateCircle() {
    circle.setLatLng([currentLat, currentLng]);
    circle.setRadius(currentRadius * 1000);
}

function triggerSearch() {
    // Clear existing timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // Debounce search to avoid too many API calls
    searchTimeout = setTimeout(() => {
        // Hide filter container during search
        document.getElementById('filter-container').style.display = 'none';
        showResult('Searching for departures...', 'loading');
        fetchDeparturesByGeo(currentLat, currentLng, currentRadius);
    }, 500);
}

function useCurrentLocation() {
    handleGeolocation(
        function (position) {
            updateLocationAndSearch(position.coords.latitude, position.coords.longitude, 15);
        },
        function (error) {
            alert('Error getting location: ' + error.message);
        }
    );
}

function showResult(message, className) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.className = className;
    resultsDiv.innerHTML = message;
}

function formatTime(timeString) {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function getTimeDifference(planned, expected) {
    if (!planned || !expected) return null;
    const plannedTime = new Date(planned);
    const expectedTime = new Date(expected);
    const diffMs = expectedTime - plannedTime;
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    return diffMinutes;
}

function formatTimeDifference(minutes) {
    if (minutes === 0 || Math.abs(minutes) <= 2) return '';
    const sign = minutes > 0 ? '+' : '-';
    const absMinutes = Math.abs(minutes);
    const hours = Math.floor(absMinutes / 60);
    const mins = absMinutes % 60;

    if (hours > 0) {
        return ` (${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')})`;
    } else {
        return ` (${sign}${mins.toString().padStart(2, '0')})`;
    }
}

function formatTimeDisplay(planned, expected) {
    const timeStatus = getTimeStatus(planned, expected);
    
    if (!timeStatus.isDelayed && !timeStatus.isEarly) {
        return `<span class="expected-time">${formatTime(expected)}</span>`;
    } else {
        const plannedTime = formatTime(planned);
        const expectedTime = formatTime(expected);
        const timeDiffText = formatTimeDifference(timeStatus.timeDiff);
        const delayClass = timeStatus.isDelayed ? 'delayed' : 'early';

        return `
            <span class="planned-time strikethrough">${plannedTime}</span>
            <span class="expected-time ${delayClass}">${expectedTime}${timeDiffText}</span>
        `;
    }
}

function getStatusClass(status) {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('driving')) return 'status-driving';
    if (statusLower.includes('arriving')) return 'status-arriving';
    if (statusLower.includes('delayed')) return 'status-delayed';
    return 'status-driving';
}

function createFilterButtons(data) {
    const filterContainer = document.getElementById('filter-container');
    const filterButtons = document.getElementById('filter-buttons');

    // Clear existing buttons
    filterButtons.innerHTML = '';

    // Collect all unique line numbers with their transport types
    const lineTransportMap = new Map(); // Map line number to transport type

    Object.entries(data).forEach(([transportType, stations]) => {
        const stationArray = processStationArray(stations);

        stationArray.forEach(station => {
            const departures = station.Departures || [];
            departures.forEach(departure => {
                const key = isTrainDeparture(departure)
                    ? (departure.TransportTypeCode || departure.TransportType)
                    : departure.LineNumber;
                if (!lineTransportMap.has(key)) {
                    lineTransportMap.set(key, departure.TransportType);
                }
            });
        });
    });

    // Create filter buttons with transport type colors
    Array.from(lineTransportMap.keys()).sort().forEach(lineNumber => {
        const transportType = lineTransportMap.get(lineNumber);
        const button = document.createElement('button');

        // Use the utility function to get transport class
        const transportClass = getTransportClass(transportType, '');

        button.className = `filter-button ${transportClass}`;
        button.textContent = lineNumber;
        button.onclick = () => toggleFilter(lineNumber);
        filterButtons.appendChild(button);
    });

    // Show filter container if we have lines
    filterContainer.style.display = lineTransportMap.size > 0 ? 'block' : 'none';
}

function toggleFilter(lineNumber) {
    const button = event.target;
    const allButtons = document.querySelectorAll('.filter-button');
    const allLineNumbers = Array.from(allButtons).map(btn => btn.textContent);
    
    // If all buttons are currently "on" (not filtered)
    if (filteredLines.size === 0) {
        // Turn off all except the tapped one
        allLineNumbers.forEach(line => {
            if (line !== lineNumber) {
                filteredLines.add(line);
                const btn = Array.from(allButtons).find(b => b.textContent === line);
                if (btn) btn.classList.add('filtered');
            }
        });
    } else {
        // Some buttons are filtered
        if (filteredLines.has(lineNumber)) {
            // Remove from filtered set
            filteredLines.delete(lineNumber);
            button.classList.remove('filtered');
        } else {
            // Add to filtered set
            filteredLines.add(lineNumber);
            button.classList.add('filtered');
        }
        
        // If this would cause all buttons to be off, turn them all on
        if (filteredLines.size === allLineNumbers.length) {
            filteredLines.clear();
            allButtons.forEach(btn => btn.classList.remove('filtered'));
        }
    }

    reapplyFilters();
}

function reapplyFilters() {
    if (allDeparturesData) {
        showResult('', 'success');
        const filteredData = applyFilters(allDeparturesData);
        showResult(formatDeparturesData(filteredData), 'success');
        updateMapLineVisibility();
    }
}

function applyFilters(data) {
    if (filteredLines.size === 0) {
        return data; // No filters applied
    }

    // Deep clone the data to avoid modifying original
    const filteredData = JSON.parse(JSON.stringify(data));

    Object.entries(filteredData).forEach(([transportType, stations]) => {
        const stationArray = processStationArray(stations);

        // Filter departures for each station
        stationArray.forEach(station => {
            if (station.Departures) {
                station.Departures = station.Departures.filter(departure => {
                    const key = isTrainDeparture(departure)
                        ? (departure.TransportTypeCode || departure.TransportType)
                        : departure.LineNumber;
                    return !filteredLines.has(key);
                });
            }
        });

        // Remove stations with no departures
        const filteredStations = stationArray.filter(station =>
            station.Departures && station.Departures.length > 0
        );

        // Update the data structure
        if (Array.isArray(stations)) {
            filteredData[transportType] = filteredStations;
        } else if (stations && typeof stations === 'object') {
            if (stations.Station_Info) {
                filteredData[transportType] = filteredStations.length > 0 ? filteredStations[0] : null;
            } else {
                // Handle other object structures
                filteredData[transportType] = filteredStations.length > 0 ? filteredStations : null;
            }
        }
    });

    return filteredData;
}

function toggleStation(stationId) {
    const header = document.querySelector(`#${stationId}`).previousElementSibling;
    const content = document.getElementById(stationId);

    if (content.classList.contains('collapsed')) {
        // Expand
        content.classList.remove('collapsed');
        header.classList.remove('collapsed');
    } else {
        // Collapse
        content.classList.add('collapsed');
        header.classList.add('collapsed');
    }
}

// Add touch-friendly interactions
function addMobileOptimizations() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Add active states for touch
    const touchElements = document.querySelectorAll('.filter-button, .station-header');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function () {
            this.style.transform = 'scale(0.95)';
        });
        element.addEventListener('touchend', function () {
            this.style.transform = '';
        });
    });
}

function formatDeparturesData(data) {
    if (!data || typeof data !== 'object') {
        return '<div class="no-departures">No departure data available</div>';
    }

    let html = '';

    // Process each transport type (skip internal _stops key)
    Object.entries(data).forEach(([transportType, stations]) => {
        if (transportType.startsWith('_')) return;
        const stationArray = processStationArray(stations);

        if (stationArray.length === 0) {
            return;
        }

        html += `
            <div class="transport-type-section">
        `;

        stationArray.forEach(station => {
            const stationInfo = station.Station_Info;
            const departures = station.Departures || [];

            if (!stationInfo) {
                console.log('Station missing Station_Info:', station);
                return;
            }

            // Handle unknown location names
            const stopName = stationInfo.StopName || 'Unknown Stop';

            // Handle distance display
            let distanceDisplay = '-';
            if (stationInfo.Distance !== null && stationInfo.Distance !== undefined && !isNaN(stationInfo.Distance)) {
                distanceDisplay = `${(stationInfo.Distance * 1000).toFixed(0)}m`;
            }

            // Build location display with integrated distance (no town)
            const locationDisplay = `<i class="fas fa-train"></i>&nbsp;${distanceDisplay} - ${stopName}`;
            console.log('Location display:', { stopName, distanceDisplay, locationDisplay });

            const stationId = `station-${Math.random().toString(36).substr(2, 9)}`;
            const stopCode = stationInfo.StopCode || '';
            html += `
                <div class="departures-container" data-stopcode="${stopCode}">
                    <h3 class="station-header" onclick="toggleStation('${stationId}')">
                        ${locationDisplay}
                    </h3>
                    <div id="${stationId}" class="station-content">
            `;

            if (departures.length === 0) {
                html += '<div class="no-departures">No departures scheduled</div>';
            } else {
                html += `
                    <table class="departures-table">
                        <thead>
                            <tr>
                                <th>Line</th>
                                <th>Destination</th>
                                <th>Departure</th>
                                <th>Status</th>
                                <th>Platform</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                departures.forEach((departure, depIndex) => {
                    const rowId = `dep-${stationId}-${depIndex}`;
                    const stopsRowId = `stops-${stationId}-${depIndex}`;
                    const isTrain = isTrainDeparture(departure);

                    if (isTrain) {
                        const timeStatus = getTrainTimeStatus(departure.PlannedDeparture, departure.Delay);
                        const platformChanged = departure.PlatformChange
                            ? `<span class="platform-change" title="Platform changed">!</span>` : '';
                        const viaHtml = departure.Via
                            ? `<br><small class="via-stops">via ${departure.Via}</small>` : '';
                        const tipsHtml = departure.Tips && departure.Tips.length > 0
                            ? `<div class="train-tips">${departure.Tips.map(t => `<small>⚠ ${t}</small>`).join('')}</div>` : '';

                        html += `
                            <tr id="${rowId}" class="departure-row train-row">
                                <td>
                                    <span class="transport-badge transport-train">
                                        ${departure.TransportTypeCode || ''}
                                    </span>
                                    <br>
                                    <small>${departure.TransportType}</small>
                                </td>
                                <td>
                                    <strong>${departure.Destination}</strong>
                                    ${viaHtml}
                                    <br>
                                    <small>${departure.Agency || ''}</small>
                                    ${tipsHtml}
                                </td>
                                <td>
                                    <div class="time-info">
                                        ${formatTrainTimeDisplay(departure.PlannedDeparture, departure.Delay)}
                                    </div>
                                </td>
                                <td>
                                    <span class="status-badge ${timeStatus.statusClass}">
                                        ${timeStatus.statusText}
                                    </span>
                                </td>
                                <td>
                                    <span class="platform">${departure.Platform || '-'}</span>
                                    ${platformChanged}
                                </td>
                            </tr>
                        `;
                    } else {
                        const timeStatus = getTimeStatus(departure.PlannedDeparture, departure.ExpectedDeparture);
                        const lineNr = (departure.LineNumber || '').replace(/'/g, "\\'");
                        const agencyCode = (departure.AgencyCode || '').replace(/'/g, "\\'");
                        const destination = (departure.Destination || '').replace(/'/g, "\\'");
                        const transportType = (departure.TransportType || '').replace(/'/g, "\\'");

                        html += `
                            <tr id="${rowId}" class="departure-row" onclick="toggleStops('${rowId}', '${stopsRowId}', '${lineNr}', '${agencyCode}', '${destination}')">
                                <td>
                                    <span class="transport-badge ${getTransportClass(departure.TransportType)}">
                                        ${departure.LineNumber}
                                    </span>
                                    <br>
                                    <small>${departure.LineName}</small>
                                </td>
                                <td>
                                    <strong>${departure.Destination}</strong>
                                    <br>
                                    <small>${departure.AgencyCode}</small>
                                </td>
                                <td>
                                    <div class="time-info">
                                        ${formatTimeDisplay(departure.PlannedDeparture, departure.ExpectedDeparture)}
                                    </div>
                                </td>
                                <td>
                                    <span class="status-badge ${timeStatus.statusClass}">
                                        ${timeStatus.statusText}
                                    </span>
                                </td>
                                <td>
                                    <span class="platform">${departure.Platform || '-'}</span>
                                    <span class="expand-arrow">▶</span>
                                </td>
                            </tr>
                            <tr id="${stopsRowId}" class="stops-row" style="display:none;">
                                <td colspan="5" class="stops-cell"></td>
                            </tr>
                        `;
                    }
                });

                html += `
                        </tbody>
                    </table>
                `;
            }

            html += '</div></div>';
        });

        html += '</div>';
    });

    return html || '<div class="no-departures">No departure data available</div>';
}

function getTransportColor(transportType) {
    const type = (transportType || '').toLowerCase();
    if (type.includes('tram'))  return '#ff9800';
    if (type.includes('metro')) return '#f44336';
    if (type.includes('train')) return '#9c27b0';
    return '#2196f3'; // bus default
}

function pickDirection(stops, destination) {
    if (!stops) return [];
    const dest = (destination || '').toLowerCase().replace(/[\s,]+/g, '');
    const score = (arr) => {
        if (!arr || arr.length === 0) return 0;
        const last = (arr[arr.length - 1].name || '').toLowerCase().replace(/[\s,]+/g, '');
        let m = 0;
        for (let i = 0; i < Math.min(dest.length, last.length); i++) {
            if (dest[i] === last[i]) m++;
        }
        return m;
    };
    return score(stops.Outbound) >= score(stops.Inbound)
        ? (stops.Outbound || stops.Inbound || [])
        : (stops.Inbound || []);
}

function formatScheduleName(name) {
    if (!name) return '';
    // Strip optional agency prefix like "gvb:" or "ret:"
    const clean = name.includes(':') ? name.split(':').slice(1).join(':') : name;
    return clean.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function pickDirection(stops, destination) {
    if (!stops) return [];
    const dest = (destination || '').toLowerCase().replace(/\s+/g, '');
    const score = (arr) => {
        if (!arr || arr.length === 0) return 0;
        const last = formatScheduleName(arr[arr.length - 1].ScheduleName).toLowerCase().replace(/\s+/g, '');
        // Check how many chars of destination appear in the last stop name
        let matches = 0;
        for (let i = 0; i < Math.min(dest.length, last.length); i++) {
            if (dest[i] === last[i]) matches++;
        }
        return matches;
    };
    const outScore = score(stops.Outbound);
    const inScore = score(stops.Inbound);
    if (inScore > outScore) return stops.Inbound;
    return stops.Outbound || stops.Inbound || [];
}

function renderStopsPanel(stops, destination, error) {
    if (error) {
        return `<div class="stops-error">${error}</div>`;
    }
    const direction = pickDirection(stops, destination);
    if (!direction || direction.length === 0) {
        return `<div class="stops-error">No stop data available.</div>`;
    }
    const items = direction.map(stop => `
        <div class="stop-item">
            <span class="stop-dot"></span>
            <span class="stop-name">${formatScheduleName(stop.name)}</span>
        </div>
    `).join('');
    return `<div class="stops-panel"><div class="stops-list">${items}</div></div>`;
}

async function toggleStops(rowId, stopsRowId, linenr, agency, destination) {
    const row = document.getElementById(rowId);
    const stopsRow = document.getElementById(stopsRowId);
    if (!stopsRow) return;

    const isOpen = stopsRow.style.display !== 'none';
    if (isOpen) {
        stopsRow.style.display = 'none';
        row.classList.remove('expanded');
        return;
    }

    stopsRow.style.display = '';
    row.classList.add('expanded');

    const cell = stopsRow.querySelector('.stops-cell');
    if (cell.dataset.loaded === 'true') return;

    cell.innerHTML = '<div class="stops-loading">Loading stops…</div>';

    const cacheKey = `${linenr}|${agency}`;
    try {
        let stopsData;
        if (lineDataCache.has(cacheKey)) {
            stopsData = lineDataCache.get(cacheKey);
        } else {
            const url = `${API_BASE_URL}/linestops?linenr=${encodeURIComponent(linenr)}&agency=${encodeURIComponent(agency)}`;
            const resp = await fetch(url);
            const json = await resp.json();
            if (!resp.ok) throw new Error(json.error || resp.statusText);
            stopsData = json.stops;
            lineDataCache.set(cacheKey, stopsData);
        }
        cell.innerHTML = renderStopsPanel(stopsData, destination, null);
        cell.dataset.loaded = 'true';
    } catch (err) {
        cell.innerHTML = renderStopsPanel(null, null, 'Could not load stops: ' + err.message);
        cell.dataset.loaded = 'true';
    }
}

function buildLineLayer(lineNr, transportType, stopsData, lineName) {
    const layer = L.layerGroup();
    const color = getTransportColor(transportType);
    const direction = pickDirection(stopsData, '');
    if (!direction || direction.length < 2) return layer;

    // Parse terminus names from LineName ("A - B" format) as the authoritative labels.
    // The /line/stops API often returns a truncated route, so we use the departure's
    // LineName instead of the actual first/last stop name from the stops data.
    const termini = (lineName || '').split(' - ').map(s => s.trim()).filter(Boolean);
    const startLabel = termini[0] || formatScheduleName(direction[0].name);
    const endLabel   = termini[1] || formatScheduleName(direction[direction.length - 1].name);

    // Route polyline
    L.polyline(direction.map(s => [s.lat, s.lng]), {
        color, weight: 3, opacity: 0.75, lineJoin: 'round',
    }).addTo(layer);

    // Stop markers — endpoints: white-bordered filled dot; intermediates: white-filled dot
    direction.forEach((stop, i) => {
        const isFirst = i === 0;
        const isLast  = i === direction.length - 1;
        const isEndpoint = isFirst || isLast;
        const stopName = formatScheduleName(stop.name);
        const label    = isFirst ? startLabel : isLast ? endLabel : null;

        const marker = L.circleMarker([stop.lat, stop.lng], {
            color:       isEndpoint ? 'white' : color,
            fillColor:   color,
            fillOpacity: isEndpoint ? 1 : 0.85,
            opacity:     1,
            radius:      isEndpoint ? 7 : 4,
            weight:      isEndpoint ? 2.5 : 1.5,
        });

        if (isEndpoint) {
            marker.bindTooltip(label, {
                permanent: true,
                direction: isFirst ? 'right' : 'left',
                className: 'stop-endpoint-label',
                offset: [isFirst ? 10 : -10, 0],
            });
        }

        marker.bindPopup(
            `<strong>${stopName}</strong>` +
            (isEndpoint && label !== stopName
                ? `<br><small>Terminus: ${label}</small>` : '') +
            `<br><small>Line ${lineNr}${isFirst ? ' · start' : isLast ? ' · end' : ''}</small>`,
            { maxWidth: 200 }
        );

        marker.addTo(layer);
    });

    return layer;
}

async function loadAllLineShapes(data) {
    // Remove old line layers from map and clear the map
    lineLayersMap.forEach(layer => map.removeLayer(layer));
    lineLayersMap.clear();

    // Collect unique BTMF lines
    const lines = new Map();
    Object.entries(data).forEach(([type, stations]) => {
        if (type.startsWith('_')) return;
        processStationArray(stations).forEach(station => {
            (station.Departures || []).forEach(dep => {
                if (!isTrainDeparture(dep) && dep.LineNumber && dep.AgencyCode) {
                    const key = `${dep.LineNumber}|${dep.AgencyCode}`;
                    if (!lines.has(key)) {
                        lines.set(key, {
                            lineNr: dep.LineNumber,
                            agency: dep.AgencyCode,
                            transportType: dep.TransportType,
                            lineName: dep.LineName || '',
                        });
                    }
                }
            });
        });
    });

    await Promise.all(Array.from(lines.entries()).map(async ([key, info]) => {
        try {
            let stopsData;
            if (lineDataCache.has(key)) {
                stopsData = lineDataCache.get(key);
            } else {
                const url = `${API_BASE_URL}/linestops?linenr=${encodeURIComponent(info.lineNr)}&agency=${encodeURIComponent(info.agency)}`;
                const resp = await fetch(url);
                const json = await resp.json();
                if (!resp.ok || json.error) return;
                stopsData = json.stops;
                lineDataCache.set(key, stopsData);
            }
            const layer = buildLineLayer(info.lineNr, info.transportType, stopsData, info.lineName);
            lineLayersMap.set(key, layer);
            if (!filteredLines.has(info.lineNr)) {
                layer.addTo(map);
            }
        } catch (err) {
            console.warn(`Line ${info.lineNr}: ${err.message}`);
        }
    }));
}

function updateMapLineVisibility() {
    lineLayersMap.forEach((layer, key) => {
        const lineNr = key.split('|')[0];
        if (filteredLines.has(lineNr)) {
            map.removeLayer(layer);
        } else {
            layer.addTo(map);
        }
    });
}

function renderStopMarkers(stops) {
    // Only renders TRAIN station markers — BTMF stops come from line layers
    if (!stopMarkersLayer) return;
    stopMarkersLayer.clearLayers();

    (stops || []).filter(s => s.Type === 'TRAIN').forEach(stop => {
        if (!stop.Latitude || !stop.Longitude) return;

        L.circleMarker([stop.Latitude, stop.Longitude], {
            color: '#6a0dad', fillColor: '#9c27b0',
            fillOpacity: 0.9, opacity: 1, radius: 10, weight: 2,
        })
        .bindPopup(
            `<strong>${stop.StopName}</strong><br>` +
            `<small>🚆 Train station</small>` +
            (stop.Distance ? `<br><small>${parseFloat(stop.Distance).toFixed(0)} m away</small>` : ''),
            { maxWidth: 180 }
        )
        .on('click', () => {
            const el = document.querySelector(`[data-stopcode="${stop.StopCode}"]`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                el.classList.add('stop-highlight');
                setTimeout(() => el.classList.remove('stop-highlight'), 1500);
            }
        })
        .addTo(stopMarkersLayer);
    });
}

function fetchDeparturesByGeo(lat = 52.37816692, lng = 4.8993346, distance = 0.5) {
    const geoUrl = `${API_BASE_URL}/departures?lat=${lat}&lng=${lng}&distance=${distance}`;

    fetch(geoUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            if (!response.ok) {
                return response.json().then(function (errorData) {
                    throw new Error('HTTP ' + response.status + ': ' + (errorData.message || response.statusText));
                });
            }
            return response.json();
        })
        .then(function (data) {
            // Store the original data and create filter buttons
            allDeparturesData = data;
            createFilterButtons(data);

            // Clear filters on fresh load
            filteredLines.clear();

            // TRAIN station markers
            renderStopMarkers(data._stops);

            // BTMF line routes + stop markers (async, non-blocking)
            loadAllLineShapes(data);

            showResult(formatDeparturesData(data), 'success');
        })
        .catch(function (error) {
            console.error('Geo Error:', error);
            showResult('API Error: ' + error.message, 'error');
        });
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function () {
    initMap();
    addMobileOptimizations();
}); 