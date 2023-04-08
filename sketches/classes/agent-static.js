class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Agent {
  constructor(
    { x, y, radius, color } = { x: 0, y: 0, radius: 0, color: '#000' }
  ) {
    this.color = color;
    this.position = new Position(x, y);
    this.radius = radius;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
