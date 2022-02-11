const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');

const settings = {
  dimensions: [1080, 1080],
};

const imageUrl = 'https://avatars.githubusercontent.com/u/15015608?v=4';
const GLYPHS = '_;/#$&^*@!%'.split('');

let manager;

async function start() {
  const head = document.querySelector('head');
  const font = document.createElement('link');
  font.setAttribute(
    'href',
    'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap'
  );
  font.setAttribute('rel', 'stylesheet');
  font.addEventListener('load', async () => {
    manager = await canvasSketch(sketch, settings)
  });
  head.appendChild(font);
}

function getGlyph(v) {
  if (v < 50) return '';
  if (v < 100) return '.';
  if (v < 150) return '-';
  if (v < 200) return '+';

  return random.pick(GLYPHS);
}

function importImage(ctx, imageUrl, ...params) {
  const image = new Image();
  image.src = imageUrl;
  image.onload = () => {
    ctx.drawImage(image, ...params)
  }
}

let text = 'A';
let fontFamily = 'Playfair Display';
const cellSize = 20;

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
    typeCtx.fillRect(0, 0, cols, rows);

    typeCtx.fillStyle = 'white';
    typeCtx.font = `${fontSize}px '${fontFamily}'`;
    typeCtx.textBaseline = 'top';

    const metrics = typeCtx.measureText(text);
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

    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;

    typeCtx.save();
    typeCtx.translate(tx, ty);
    typeCtx.fillText(text, 0, 0);
    typeCtx.restore();

    const typeData = typeCtx.getImageData(0, 0, cols, rows).data;
    ctx.drawImage(typeCanvas, 0, 0);

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
      if (random.chance())
        ctx.font = `${cellSize * random.range(0.7, 3)}px ${fontFamily}`;
      else ctx.font = `${cellSize * 1.5}px ${fontFamily}`;

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
