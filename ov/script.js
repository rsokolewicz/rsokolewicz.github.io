// Your Vercel API endpoint
const API_BASE_URL = 'https://ov-public-api-gamma.vercel.app/api';

// Map variables
let map, marker, circle;
let currentLat = 52.3676; // Amsterdam default
let currentLng = 4.9041;
let currentRadius = 0.5; // 500m in km
let searchTimeout;
let filteredLines = new Set(); // Set of filtered line numbers
let allDeparturesData = null; // Store the original data

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
                // Store the transport type for this line number
                // If a line appears in multiple transport types, use the first one found
                if (!lineTransportMap.has(departure.LineNumber)) {
                    lineTransportMap.set(departure.LineNumber, departure.TransportType);
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
                station.Departures = station.Departures.filter(departure =>
                    !filteredLines.has(departure.LineNumber)
                );
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

    // Process each transport type
    Object.entries(data).forEach(([transportType, stations]) => {
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
            html += `
                <div class="departures-container">
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

                departures.forEach(departure => {
                    const timeStatus = getTimeStatus(departure.PlannedDeparture, departure.ExpectedDeparture);

                    // Determine status based on time difference
                    let statusText = timeStatus.statusText;
                    let statusClass = timeStatus.statusClass;

                    html += `
                        <tr>
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
                                <span class="status-badge ${statusClass}">
                                    ${statusText}
                                </span>
                            </td>
                            <td>
                                <span class="platform">${departure.Platform || '-'}</span>
                            </td>
                        </tr>
                    `;
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

            // Clear any existing filters
            filteredLines.clear();

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