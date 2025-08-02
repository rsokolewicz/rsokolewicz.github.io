const width = window.innerWidth;
const height = window.innerHeight;

// Update the SVG selection to use 100% of viewport width and height
const svg = d3.select("svg")
  // .attr("width", "100%")
  // .attr("height", "100%");

// Create a separate group for the zoomable content
const zoomG = svg.append("g");

const outerG = zoomG
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

const innerG = outerG.append("g");

const paths = innerG.append("g").attr("class", "paths");

let globalTimer = null; // Store the timer

class Planet {
  constructor(name, radius, distance, angularVelocity, color) {
    this.name = name;
    this.radius = radius;
    this.distance = distance;
    this.angularVelocity = angularVelocity;
    this.color = color;
    this.angle = 0;
    this.traceGroup = paths.append("g").attr("class", "trace");
    this.traceData = [];
    this.x = distance;
    this.y = 0;
    this.orbitComplete = false;
    this.lastPos = { x: 0, y: 0 };
  }

  createPlanetElement(group) {
    this.group = group.append("g").attr("class", "planet");

    this.group
      .append("circle")
      .attr("r", this.radius)
      .attr("fill", "black")
      .attr("stroke", this.color);

    this.group
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .text(this.name);

    this.group.on("click", () => selectPlanet(this));
  }

  reset() {
    this.traceData = [];
    this.traceGroup.selectAll("*").remove();
    this.orbitComplete = false;
    this.lastPos = { x: 0, y: 0 };
  }

  updatePosition(elapsed, planetRef) {
    const pos = this.position(elapsed);
    const posRef = planetRef.position(elapsed);

    const newPos = {
      x: pos.x - posRef.x,
      y: pos.y - posRef.y
    };

    this.group
      .transition()
      .duration(16) // Approximately 60 FPS
      .attrTween("transform", () => {
        return t => {
          const interpolatedX = d3.interpolate(this.lastPos.x, newPos.x)(t);
          const interpolatedY = d3.interpolate(this.lastPos.y, newPos.y)(t);
          return `translate(${interpolatedX}, ${interpolatedY})`;
        };
      });

    this.lastPos = newPos;

    this.traceData.push([-posRef.x + pos.x, -posRef.y + pos.y]);

    // Keep only the last 200 trace points
    if (this.traceData.length > 300) {
      this.traceData = this.traceData.slice(-300);
    }

    // Update line segments
    const lineSegments = this.traceGroup.selectAll("line")
      .data(this.traceData.slice(1));

    lineSegments.enter()
      .append("line")
      .attr("class", "trace-line")
      .merge(lineSegments)
      .attr("x1", (d, i) => this.traceData[i][0])
      .attr("y1", (d, i) => this.traceData[i][1])
      .attr("x2", d => d[0])
      .attr("y2", d => d[1])
      .attr("stroke", (d, i) => `${this.color}${Math.floor((i + 1) / this.traceData.length * 255).toString(16).padStart(2, '0')}`);

    lineSegments.exit().remove();
  }

  position(elapsed) {
    const angle = elapsed * this.angularVelocity;
    const x = Math.cos(angle) * this.distance;
    const y = Math.sin(angle) * this.distance;
    return { x: x, y: y };
  }
}

let animationRate = 0.5;
let scale = 7;
const planetsData = [
  {
    name: "Sun",
    radius: scale * 6,
    distance: 0,
    angularVelocity: animationRate,
    color: "#FDB813"
  },
  {
    name: "Me",
    radius: scale * 1.8,
    distance: 70,
    angularVelocity: (animationRate / 7) * 29,
    color: "#B5A7A7"
  },
  {
    name: "Ve",
    radius: scale * 3.76,
    distance: 130,
    angularVelocity: (animationRate / 8) * 13,
    color: "#FFC649"
  },
  {
    name: "Ea",
    radius: scale * 3.959,
    distance: 200,
    angularVelocity: animationRate / 1,
    color: "#6B93D6"
  },
  {
    name: "Ma",
    radius: scale * 2.106,
    distance: 270,
    angularVelocity: animationRate / 2,
    color: "#C1440E"
  },
];

const planets = planetsData.map(
  (d) => new Planet(d.name, d.radius, d.distance, d.angularVelocity, d.color)
);
planets.forEach((planet) => {
  planet.createPlanetElement(innerG);
});
const earth = planets.find((planet) => planet.name == "Ea");
const sun = planets.find((planet) => planet.name == "Sun");

let animationFrameId = null;
let selectedPlanet = null;
let startTime = null;



// Modify your animation function
function animate(currentTime) {
  if (!startTime) startTime = currentTime;
  const elapsed = (currentTime - startTime) * 0.001; // Convert to seconds

  planets.forEach((planet) => {
    planet.updatePosition(elapsed, selectedPlanet);
  });

  animationFrameId = requestAnimationFrame(animate);
}



function selectPlanet(newSelectedPlanet) {
  planets.forEach((planet) => {
    planet.reset();
  });

  selectedPlanet = newSelectedPlanet;
  startTime = null;

  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(animate);
  }
}

selectPlanet(earth);

// Initialize zoom behavior
const zoom = d3.zoom()
  .scaleExtent([0.1, 10])
  .on("zoom", handleZoom);

// Set initial transform
const initialTransform = d3.zoomIdentity.translate(0, 0).scale(1);
zoomG.attr("transform", initialTransform);

// Apply zoom behavior to SVG
svg.call(zoom).call(zoom.transform, initialTransform);

function handleZoom(event) {
  zoomG.attr("transform", event.transform);
}

// Add a resize event listener
window.addEventListener('resize', handleResize);

function handleResize() {
  // Get the new dimensions
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  
  // Update the center position for outerG
  outerG.attr("transform", `translate(${newWidth / 2}, ${newHeight / 2})`);
  
  // You might want to adjust the zoom behavior here if needed
}



// Add this line at the end of your script
console.log('Animation script loaded');