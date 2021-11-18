import { random } from 'canvas-sketch-util';

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Agent {
  constructor({ x, y, radius } = { x: 0, y: 0, radius: 0 }) {
    this.position = new Vector(x, y);
    this.radius = random.range(1, 20);
    this.velocity = new Vector(
      Math.sqrt(random.range(0.001, 0.003) * this.radius) * random.sign(),
      Math.sqrt(random.range(0.001, 0.003) * this.radius) * random.sign()
    );
  }

  bounce(width, height) {
    if (this.position.x <= 0 || this.position.x >= width) this.velocity.x *= -1;
    if (this.position.y <= 0 || this.position.y >= height)
      this.velocity.y *= -1;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);

    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(0, 0, Math.abs(this.radius), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
