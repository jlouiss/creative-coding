const canvasSketch = require('canvas-sketch');

class Point {
  constructor({ x, y, control = false }) {
    this.control = control;
    this.x = x;
    this.y = y;
    this.isDragging = false;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = 'coral';
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

const settings = {
  animate: true,
  dimensions: [1080, 1080],
};

let canvasElement;

const points = [
  new Point({ x: 200, y: 540 }),
  new Point({ x: 400, y: 700 }),
  new Point({ x: 880, y: 540 }),
  new Point({ x: 600, y: 700 }),
  new Point({ x: 640, y: 900 }),
];

const sketch = ({ canvas }) => {
  canvasElement = canvas;

  canvas.addEventListener('mousedown', onMouseDown);

  return ({ context: ctx, width, height }) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // draw control lines
    // ctx.beginPath();
    // ctx.moveTo(points[0].x, points[0].y);
    // ctx.strokeStyle = '#999';
    // for (let i = 1; i < points.length; i += 1) {
    //   ctx.lineTo(points[i].x, points[i].y);
    // }
    // ctx.stroke();

    ctx.beginPath();

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      const mx = current.x + (next.x - current.x) / 2;
      const my = current.y + (next.y - current.y) / 2;

      // draw control midpoints
      // ctx.beginPath();
      // ctx.arc(mx, my, 4, 0, Math.PI * 2);
      // ctx.fillStyle = 'cornflowerblue';
      // ctx.fill();

      // draw curve
      if (i === 0) ctx.moveTo(current.x, current.y);
      else if (i === points.length - 2)
        ctx.quadraticCurveTo(current.x, current.y, next.x, next.y);
      else ctx.quadraticCurveTo(current.x, current.y, mx, my);
    }

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'limegreen';
    ctx.stroke();

    points.forEach((p) => p.draw(ctx));
  };
};

const onMouseDown = ({ offsetX: oX, offsetY: oY }) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  const {
    height: h,
    offsetHeight: cH,
    offsetWidth: cW,
    width: w,
  } = canvasElement;
  const x = (oX / cW) * w;
  const y = (oY / cH) * h;

  let isAnyPointControlled = false;
  points.forEach((p) => {
    p.isDragging = p.isNearMouse(x, y);
    if (!isAnyPointControlled && p.isDragging) isAnyPointControlled = true;
  });

  if (!isAnyPointControlled) {
    points.push(new Point({ x, y }));
  }
};

const onMouseMove = ({ offsetX: oX, offsetY: oY }) => {
  const {
    height: h,
    offsetHeight: cH,
    offsetWidth: cW,
    width: w,
  } = canvasElement;
  const x = (oX / cW) * w;
  const y = (oY / cH) * h;

  points.forEach((p) => {
    if (!p.isDragging) return;

    p.x = x;
    p.y = y;
  });
};

const onMouseUp = (e) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

canvasSketch(sketch, settings);
