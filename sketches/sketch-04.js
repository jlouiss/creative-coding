import { canvasSketch } from 'canvas-sketch';
import { math, random } from 'canvas-sketch-util';
import { Pane } from 'tweakpane';

const settings = {
  animate: true,
  dimensions: [1080, 1080],
};

const PARAMS = {
  animate: true,
  amplitude: 0.7,
  background: '#111',
  columns: 30,
  foreground: '#ddd',
  frame: 0,
  frequency: 0.001,
  rows: 30,
  scaleMax: 6,
  scaleMin: 0.001,
};

const sketch = () => {
  return ({ context: ctx, width: w, height: h, frame }) => {
    document.body.style.backgroundColor = PARAMS.background;
    document.querySelector('canvas').style.boxShadow =
      '0px 0px 200px 0 rgb(255, 255, 255, .2)';
    ctx.fillStyle = PARAMS.background;
    ctx.fillRect(0, 0, w, h);

    const gridWidth = w * 0.8;
    const gridHeight = h * 0.8;
    const marginX = (w - gridWidth) / 2;
    const marginY = (h - gridHeight) / 2;
    const cellWidth = gridWidth / PARAMS.columns;
    const cellHeight = gridHeight / PARAMS.rows;

    const cells = PARAMS.columns * PARAMS.rows;

    for (let i = 0; i < cells; i++) {
      const column = i % PARAMS.columns;
      const row = Math.floor(i / PARAMS.columns);

      const cx = column * cellWidth;
      const cy = row * cellHeight;
      const cw = cellWidth * 0.8;
      const ch = cellHeight * 0.8;

      const f = PARAMS.animate ? frame : PARAMS.frame;

      // add noise (0 - 1)
      const n = random.noise3D(
        cx,
        cy,
        (f % Number.MAX_SAFE_INTEGER) * 10,
        PARAMS.frequency,
        PARAMS.amplitude
      );
      const angle = n * Math.PI;
      const scale = math.mapRange(n * 2, -1, 1, PARAMS.scaleMin, PARAMS.scaleMax);

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

      ctx.strokeStyle = PARAMS.foreground;
      ctx.lineWidth = scale;
      ctx.stroke();

      ctx.restore();
    }
  };
};

const createPane = () => {
  const pane = new Pane();
  const grid = pane.addFolder({ title: 'Grid' });
  grid.addInput(PARAMS, 'columns', { min: 2, max: 50, step: 1 });
  grid.addInput(PARAMS, 'rows', { min: 2, max: 50, step: 1 });
  grid.addInput(PARAMS, 'scaleMin', { min: 0.001, max: 15 });
  grid.addInput(PARAMS, 'scaleMax', { min: 0.001, max: 50 });

  const noise = pane.addFolder({ title: 'Noise' });
  noise.addInput(PARAMS, 'frequency', { min: -0.01, max: 0.01 });
  noise.addInput(PARAMS, 'amplitude', { min: 0, max: 1 });
  noise.addInput(PARAMS, 'animate');
  noise.addInput(PARAMS, 'frame', { min: 0, max: 1000, step: 1 });
};

// createPane();
canvasSketch(sketch, settings);
