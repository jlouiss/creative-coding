class Point {
  constructor({ x, y, lineWidth, color}) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.lineWidth = lineWidth;
    this.initialX = x;
    this.initialY = y;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isNearMouse(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dd = Math.sqrt(dx * dx + dy * dy);
    return dd < 20;
  }
}

module.exports = { Point };
