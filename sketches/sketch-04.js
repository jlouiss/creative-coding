import { canvasSketch } from 'canvas-sketch';
import { math, random } from 'canvas-sketch-util';

const settings = {
  animate: true,
  dimensions: [1080, 1080],
};

const COLUMNS = 10;
const ROWS = 10;

const sketch = () => {
  return ({ context: ctx, width: w, height: h, frame }) => {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);

    const gridWidth = w * 0.8;
    const gridHeight = h * 0.8;
    const marginX = (w - gridWidth) / 2;
    const marginY = (h - gridHeight) / 2;
    const cellWidth = gridWidth / COLUMNS;
    const cellHeight = gridHeight / ROWS;

    const cells = COLUMNS * ROWS;

    for (let i = 0; i < cells; i++) {
      const column = i % COLUMNS;
      const row = Math.floor(i / COLUMNS);

      const cx = column * cellWidth;
      const cy = row * cellHeight;
      const cw = cellWidth * 0.8;
      const ch = cellHeight * 0.8;

      // add noise (0 - 1)
      const n = random.noise2D(cx + (frame % Number.MAX_SAFE_INTEGER) * 10, cy, 0.001);
      const angle = n * Math.PI * 0.5;
      const scale = math.mapRange(n, -1, 1, .1, 12);

      const translateX = cx + cw / 2 + marginX;
      const translateY = cy + ch / 2 + marginY;

      ctx.save();

      // TOP LEFT is (cw / -2, ch / -2)
      // BOTTOM RIGHT is (cw / 2, ch / 2)
      // CENTER is (0, 0)

      // // Move to center of the cell (0, 0) is the center
      // ctx.translate(cx, cy);
      // // Account for margins
      // ctx.translate(marginX, marginY);
      // // Move the cell to have (0, 0) at the center;
      // ctx.translate(cw / 2, ch / 2);

      ctx.translate(translateX, translateY);
      ctx.rotate(angle);

      ctx.beginPath();

      // draw quadrangle
      // ctx.moveTo(-cw / 2, -ch / 2);
      // ctx.lineTo(cw / 2, -ch / 2);
      // ctx.lineTo(cw / 2, ch / 2);
      // ctx.lineTo(-cw / 2, ch / 2);
      // ctx.lineTo(-cw / 2, -ch / 2);

      ctx.moveTo(-cw / 2, 0);
      ctx.lineTo(cw / 2, 0);

      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = scale;
      ctx.stroke();

      ctx.restore();
    }
  };
};

canvasSketch(sketch, settings);
