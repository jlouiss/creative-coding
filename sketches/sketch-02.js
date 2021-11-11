const canvasSketch = require('canvas-sketch');
const { math, random } = require('canvas-sketch-util');

const settings = {
  dimensions: [1080, 1080],
};

const { range } = random;

const sketch = () => {
  return ({ context: ctx, width, height }) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'black';

    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    const num = 600;
    const radius = width * 0.3;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      ctx.save();
      ctx.fillStyle = `rgba(
        ${range(0, 80)},
        ${range(0, 20)},
        ${range(0, 50)},
        ${range(0.8, 1)}
      )`;
      ctx.translate(x, y);
      ctx.rotate(-angle);
      ctx.scale(range(0.1, 2), 1);

      ctx.beginPath();
      ctx.rect(
        -w * 0.5,
        range(0, -h * 0.5),
        w * range(0.1, 1.5),
        h * range(0.5, 1.8)
      );
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle);

      ctx.lineWidth = range(2, 15);

      ctx.beginPath();
      ctx.arc(
        0,
        0,
        radius * range(0.5, 1.5),
        slice * range(0, -5),
        slice * range(0, 3)
      );
      ctx.stroke();
      ctx.restore();
    }
  };
};

canvasSketch(sketch, settings);
