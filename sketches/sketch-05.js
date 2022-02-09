const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1080, 1080],
};

let manager;

async function start() {
  loadFont();
  manager = await canvasSketch(sketch, settings);
}

function loadFont() {
  const head = document.querySelector('head');
  const font = document.createElement('link');
  font.setAttribute(
    'href',
    'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap'
  );
  font.setAttribute('rel', 'stylesheet');
  head.appendChild(font);
}

let text = 'A';
let fontSize = 1200;
let fontFamily = 'Playfair Display';

const sketch = () => {
  return ({ context: ctx, width, height }) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'black';
    ctx.font = `${fontSize}px '${fontFamily}'`;
    ctx.textBaseline = 'top';

    const metrics = ctx.measureText(text);
    const {
      actualBoundingBoxAscent: top,
      actualBoundingBoxDescent: bottom,
      actualBoundingBoxLeft: left,
      actualBoundingBoxRight: right,
    } = metrics;
    const mx = left * -1;
    const my = top * -1;
    const mw = left + right;
    const mh = top + bottom;

    const x = (width - mw) * 0.5 - mx;
    const y = (height - mh) * 0.5 - my;

    ctx.save();
    ctx.translate(x, y);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };
};

document.addEventListener('keyup', event => {
  text = event.key;
  manager.render();
});

start();
