const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';

    const x = width * .5;
    const y = height * .5;
    const w = width * .3;
    const h = height * .3;

    context.save();
    context.translate(x, y);
    context.rotate(.3);

    context.beginPath();
    context.rect(-w * .5, -h * .5, w, h);
    context.fill();
    context.restore();
  };
};

canvasSketch(sketch, settings);
