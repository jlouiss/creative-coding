import canvasSketch from 'canvas-sketch';
import eases from 'eases';
import { math, random } from 'canvas-sketch-util';
import colormap from 'colormap';
const colormapKeys = ['jet', 'hsv', 'hot', 'spring', 'summer', 'autumn', 'winter', 'bone', 'copper', 'greys', 'yignbu', 'greens', 'yiorrd', 'bluered', 'rdbu', 'picnic', 'rainbow', 'portland', 'blackbody', 'earth', 'electric', 'alpha', 'viridis', 'inferno', 'magma', 'plasma', 'warm', 'cool', 'rainbow-soft', 'bathymetry', 'cdom', 'chlorophyll', 'density', 'freesurface-blue', 'freesurface-red', 'oxygen', 'par', 'phase', 'salinity', 'temperature', 'turbidity', 'velocity-blue', 'velocity-green', 'cubehelix'];

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};
const colors = colormap({
  colormap: random.pick(colormapKeys),
  nshades: 20,
});

let canvasElement;
const cursor = { x: Infinity, y: Infinity };
const circles = 15;
const ringsGap = 20;
const dotGap = 4;
const initialDotRadius = 12;
const fitRadius = initialDotRadius;

const sketch = ({ width, height, canvas }) => {
  canvasElement = canvas;
  canvas.addEventListener('mousedown', onMouseDown);

  const particles = [];
  let circleRadius = 0;
  let dotRadius = initialDotRadius;
  for (let i = 0; i < circles; i++) {
    const circ = Math.PI * 2 * circleRadius;
    const circlesPerRing = i ? Math.floor(circ / (fitRadius * 2 + dotGap)) : 1;
    const sliceSize = (Math.PI * 2) / circlesPerRing;

    for (let j = 0; j < circlesPerRing; j++) {
      const theta = sliceSize * j;
      const x = Math.cos(theta) * circleRadius + width / 2;
      const y = Math.sin(theta) * circleRadius + height / 2;
      particles.push(new Particle({ x, y, radius: dotRadius }));
    }

    circleRadius += fitRadius * 2 + ringsGap;
    dotRadius = (1 - eases.quadIn(i / circles)) * fitRadius;
  }

  return ({ context: ctx, width, height }) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    particles.sort((a, b) => a.scale - b.scale);
    particles.forEach((p) => {
      p.update();
      p.draw(ctx);
    });
  };
};

const onMouseMove = (e) => {
  const x = (e.offsetX / canvasElement.offsetWidth) * canvasElement.width;
  const y = (e.offsetY / canvasElement.offsetHeight) * canvasElement.height;
  cursor.x = x;
  cursor.y = y;
};
const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  onMouseMove(e);
};
const onMouseUp = (e) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  cursor.x = Infinity;
  cursor.y = Infinity;
};

canvasSketch(sketch, settings);

class Particle {
  constructor({
    ax = 0.1,
    ay = 0,
    color = 'white',
    dampening = random.range(0.9, 0.95),
    minDist = random.range(250, 300),
    pullForce = random.range(0.002, 0.04),
    pushForce = random.range(0.01, 0.02),
    radius = 10,
    scale = 1,
    vx = 0,
    vy = 0,
    x,
    y,
  }) {
    // acceleration
    this.ax = ax;
    this.ay = ay;
    // initial position
    this.ix = x;
    this.iy = y;
    // velocity
    this.vx = vx;
    this.vy = vy;
    this.x = x;
    this.y = y;
    this.color = color;
    this.dampening = dampening;
    this.minDist = minDist;
    this.pullForce = pullForce;
    this.pushForce = pushForce;
    this.radius = radius;
    this.scale = scale;
  }

  update() {
    // pull
    let dx = this.ix - this.x;
    let dy = this.iy - this.y;
    let dd = Math.sqrt(dx * dx + dy * dy);
    this.ax = dx * this.pullForce;
    this.ay = dy * this.pullForce;

    this.scale = math.mapRange(dd, 0, 200, 1, 3.5);
    const colorIndex = Math.floor(math.mapRange(dd, 0, 200, 0, colors.length - 1, true));
    this.color = colors[colorIndex]

    // push
    dx = this.x - cursor.x;
    dy = this.y - cursor.y;

    dd = Math.sqrt(dx * dx + dy * dy);
    const diff = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * diff * this.pushForce;
      this.ay += (dy / dd) * diff * this.pushForce;
    }

    this.vx += this.ax;
    this.vy += this.ay;
    this.vx *= this.dampening;
    this.vy *= this.dampening;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * this.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
