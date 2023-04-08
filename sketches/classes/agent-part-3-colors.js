import { random } from 'canvas-sketch-util';

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    // pythagoras
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export class Agent {
  constructor({ x = 0, y = 0, radius = 1, color = 'black', strokeColor = 'black' }) {
    this.position = new Vector(x, y);
    this.radius = radius;
    this.color = color;
    this.strokeColor = strokeColor;
    this.velocity = new Vector(
      Math.sqrt(random.range(1, 10) / 1000 * this.radius) * random.sign(),
      Math.sqrt(random.range(1, 10) / 1000 * this.radius) * random.sign()
    );
  }

  bounce(width, height) {
    if (this.position.x <= 0 || this.position.x >= width) this.velocity.x *= -1;
    if (this.position.y <= 0 || this.position.y >= height)
      this.velocity.y *= -1;
  }

  wrap(width, height) {
    if (this.position.x <= 0) {
      this.position.x = width;
    } else if (this.position.x > width) {
      this.position.x = 0;
    }
    if (this.position.y <= 0) {
      this.position.y = height;
    } else if (this.position.y > height) {
      this.position.y = 0;
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, 0, Math.abs(this.radius), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
