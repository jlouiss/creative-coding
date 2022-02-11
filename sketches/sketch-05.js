const canvasSketch = require('canvas-sketch');
const { random, math } = require('canvas-sketch-util');

const settings = {
  dimensions: [1080, 1080],
};

const imageUrl = 'https://avatars.githubusercontent.com/u/15015608?v=4';
const GLYPHS = '_;/#$&^*@!%'.split('');
const ASCII_GLYPHS =
  '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\' '
    .split('')
    .reverse();

let manager;
let image;
let fontLoaded = false;
let imageLoaded = false;

async function start() {
  const head = document.querySelector('head');
  const font = document.createElement('link');
  font.setAttribute(
    'href',
    'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap'
  );
  font.setAttribute('rel', 'stylesheet');
  image = new Image();
  image.src = imageUrl;
  image.crossOrigin = 'anonymous';

  font.onload = () => {
    fontLoaded = true;
    loadCanvas();
  };
  image.onload = () => {
    imageLoaded = true;
    loadCanvas();
  };

  head.appendChild(font);
}

async function loadCanvas() {
  if (fontLoaded && imageLoaded) {
    manager = await canvasSketch(sketch, settings);
  }
}

function getGlyph(v) {
  const index = Math.floor(
    math.mapRange(v, 1, 255, 0, ASCII_GLYPHS.length - 1, true)
  );
  return ASCII_GLYPHS[index];
}

let text = 'A';
let fontFamily = 'monospace';
const cellSize = 6;

const typeCanvas = document.createElement('canvas');
const typeCtx = typeCanvas.getContext('2d');

const sketch = ({ context: ctx, width, height }) => {
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);
  const cells = cols * rows;
  const fontSize = cols * 1.2;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context: ctx, width, height }) => {
    typeCtx.fillStyle = 'black';
    typeCtx.drawImage(image, 0, 0, cols, rows);

    const typeData = typeCtx.getImageData(0, 0, cols, rows).data;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (let i = 0; i < cells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellSize;
      const y = row * cellSize;

      const r = typeData[i * 4];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      // const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);

      ctx.fillStyle = 'white';
      ctx.font = `${cellSize}px ${fontFamily}`;

      ctx.save();

      ctx.translate(x, y);
      ctx.translate(cellSize * 0.5, cellSize * 0.5);

      ctx.fillText(glyph, 0, 0);

      ctx.restore();
    }
  };
};

document.addEventListener('keyup', (event) => {
  text = event.key.toUpperCase();
  manager.render();
});

start();
