class Rhombus {
  constructor({ color = '#eeeae0', size = 10, x, y, xScale = 1, yScale = 1, scaleXPositive = true, scaleYPositive = true }) {
    this.color = color;
    this.size = size;
    this.x = x;
    this.y = y;
    this.xScale = xScale;
    this.yScale = yScale;
    this.initialX = x;
    this.initialY = y;
    this.initialXScale = xScale;
    this.initialYScale = yScale;
    this.scaleXPositive = scaleXPositive;
    this.scaleYPositive = scaleYPositive;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.size * this.yScale);
    ctx.lineTo(this.x + this.size * this.xScale, this.y);
    ctx.lineTo(this.x, this.y + this.size * this.yScale);
    ctx.lineTo(this.x - this.size * this.xScale, this.y);
    ctx.closePath();
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

module.exports = { Rhombus };
