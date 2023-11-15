import { math, random } from 'canvas-sketch-util';

export class CircleGridPoint {
  constructor({
    ax = 0.1,
    ay = 0,
    vx = 0,
    vy = 0,
    x,
    y,
    color,
    size = 8,
    dampening = random.range(0.8, 0.95),
    minDist = random.range(360, 460),
    pullForce = random.range(0.002, 0.2),
    pushForce = random.range(0.001, 0.7),
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
    this.initialColor = color;
    this.dampening = dampening;
    this.minDist = minDist;
    this.pullForce = pullForce;
    this.pushForce = pushForce;
    this.size = size;
    this.initialSize = size;
    this.initialX = x;
    this.initialY = y;
  }

  update({ cx, cy } = { cx: Infinity, cy: Infinity }) {
    // pull
    let dx = this.ix - this.x;
    let dy = this.iy - this.y;
    let dd = Math.sqrt(dx * dx + dy * dy);
    this.ax = dx * this.pullForce;
    this.ay = dy * this.pullForce;

    this.scale = math.mapRange(dd, 0, 200, 1, 3.5);

    // push
    dx = this.x - cx;
    dy = this.y - cy;

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
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
