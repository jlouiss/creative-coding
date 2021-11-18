import { random } from 'canvas-sketch-util';

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Agent {
  constructor({ x, y, color } = { x: 0, y: 0, radius: 0, color: '#000' }) {
    this.color = color;
    this.position = new Vector(x, y);

    this.initialRadius = random.range(1, 20);
    this.radius = this.initialRadius;
    this.radiusMovement = random.sign();
    this.radiusVelocity = random.range(0.01, 0.1);
    this.velocity = new Vector(
      Math.sqrt(
        random.range(0.001, 0.003) * this.initialRadius
      ) * random.sign(),
      Math.sqrt(
        random.range(0.001, 0.003) * this.initialRadius
      ) * random.sign()
    );

    this.initialLineWidth = random.range(0.5, 2) * this.initialRadius;
    this.lineWidth = this.initialLineWidth;
    this.lineWidthMovement = random.sign();
    this.lineWidthVelocity = random.range(0.001, 0.005);
  }

  bounce(width, height) {
    if (this.position.x <= 0 || this.position.x >= width) {
      this.velocity.x *= -1;
    }
    if (this.position.y <= 0 || this.position.y >= height) {
      this.velocity.y *= -1;
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.radius += this.radiusVelocity * this.radiusMovement;
    this.lineWidth += this.lineWidthVelocity * this.lineWidthMovement;
    if (this.radius <= 2 || this.radius > this.initialRadius) {
      this.radiusMovement *= -1;
    }
    if (this.lineWidth <= 0.5 || this.lineWidth > this.initialLineWidth) {
      this.lineWidthMovement *= -1;
    }
  }

  draw(ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;

    ctx.save();
    ctx.translate(this.position.x, this.position.y);

    ctx.beginPath();
    ctx.arc(0, 0, Math.abs(this.radius), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
