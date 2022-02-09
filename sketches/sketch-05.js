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
let fontFamily = 'Playfair Display';
const cellSize = 20;

const typeCanvas = document.createElement('canvas');
const typeCtx = typeCanvas.getContext('2d');

const sketch = ({ context: ctx, width, height }) => {
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);
  const cells = cols * rows;
  const fontSize = cols;

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
    console.dir(typeData);
    ctx.drawImage(typeCanvas, 0, 0);

    for (let i = 0; i < cells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellSize;
      const y = row * cellSize;

      const r = typeData[i * 4];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      // const a = typeData[i * 4 + 3];

      ctx.fillStyle = `rgb(${r},${g},${b})`;

      ctx.save();

      ctx.translate(x, y);
      ctx.translate(cellSize * .5, cellSize * .5);
      // ctx.fillRect(0, 0, cellSize, cellSize);
      ctx.beginPath();
      ctx.arc(0, 0, cellSize / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  };
};

document.addEventListener('keyup', event => {
  text = event.key.toUpperCase();
  manager.render();
});

start();
