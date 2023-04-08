const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * .01;

    const h = height * .1;
    const w = width * .1;
    const gap = width * .03;
    const ix = width * .17;
    const iy = height * .17;
    const offset = width * .02;

    let x, y;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        x = ix + (w + gap) * i;
        y = iy + (h + gap) * j;

        context.beginPath();
        context.rect(x, y, w, h);
        context.stroke();

        if (Math.random() > 0.5) {
          context.beginPath();
          context.rect(x + offset / 2, y + offset / 2, w - offset, h - offset);
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
