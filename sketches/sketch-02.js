const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const degToRad = degrees => degrees / 180 * Math.PI;

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';

    const cx = width * .5;
    const cy = height * .5;
    const w = width * .01;
    const h = height * .1;
    let x, y;

    const num = 12;
    const radius = width * .3;

    for (let i = 0; i < num; i++) {
      const slice = degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      context.save();
      context.translate(x, y);
      context.rotate(-angle);

      context.beginPath();
      context.rect(-w * .5, -h * .5, w, h);
      context.fill();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
