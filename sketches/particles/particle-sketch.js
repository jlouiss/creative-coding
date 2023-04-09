const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let canvasElement;
const cursor = { x: Infinity, y: Infinity };

const sketch = ({ width, height, canvas }) => {
  canvasElement = canvas;
  canvas.addEventListener('mousedown', onMouseDown);

  const particles = [];
  for (let i = 0; i < 1; i++) {
    const x = width / 2;
    const y = height / 2;
    particles.push(new Particle({ x, y }));
  }

  return ({ context: ctx, width, height }) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

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
    dampening = 0.95,
    minDist = 300,
    pullForce = 0.004,
    pushForce = 0.02,
    radius = 10,
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
    this.dampening = dampening;
    this.minDist = minDist;
    this.pullForce = pullForce;
    this.pushForce = pushForce;
    this.radius = radius;
  }

  update() {
    // pull
    let dx = this.ix - this.x;
    let dy = this.iy - this.y;
    this.ax = dx * this.pullForce;
    this.ay = dy * this.pullForce;

    // push
    dx = this.x - cursor.x;
    dy = this.y - cursor.y;

    const dd = Math.sqrt(dx * dx + dy * dy);
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
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
