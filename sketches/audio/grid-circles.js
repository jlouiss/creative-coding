import canvasSketch from 'canvas-sketch';
import { math, random } from 'canvas-sketch-util';
import eases from 'eases';
import { Point } from '../classes/point';
import { AudioPlayer } from '../classes/audio-player';

let manager;
let audioPlayer;

const seed = random.getRandomSeed();
const settings = {
  dimensions: [1080, 1080],
  animate: true,
  name: seed,
};

const parameters = {
  amplitude: 3,
  bg: '#0f0f0f',
  fg: '#ececec',
  frequency: 0.0008,
  cols: 48,
  rows: 48,
  gridHeightScale: 0.84,
  gridWidthScale: 0.84,
  easingFunctionX: eases.cubicOut,
  easingFunctionY: eases.cubicIn,
};

const sketch = ({ height, width }) => {
  const cols = parameters.cols;
  const rows = parameters.rows;
  const easingFunctionX = parameters.easingFunctionX;
  const easingFunctionY = parameters.easingFunctionY;
  const gw = width * parameters.gridWidthScale;
  const gh = height * parameters.gridHeightScale;
  const cw = gw / cols;
  const ch = gh / rows;
  const mx = (width - gw) / 2;
  const my = (height - gh) / 2;
  const points = [];
  let bins = [];

  document.querySelector('canvas').style.boxShadow =
    '0px 0px 200px 0 rgba(255, 255, 255, .2)';
  document.querySelector('body').style.background = 'black';

  for (let i = 0; i < rows * cols; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    if (col < 6 || row < 6) {
      continue;
    }

    let x = math.mapRange(
      easingFunctionX(col),
      easingFunctionX(2),
      easingFunctionX(cols - 1),
      gw - cw / 2,
      cw,
      true
    );
    let y = math.mapRange(
      easingFunctionY(row),
      easingFunctionY(2),
      easingFunctionY(rows - 1),
      gh - ch / 2,
      ch,
      true
    );
    let size = math.mapRange(
      eases.quintIn(col + row) * i,
      0,
      eases.quintIn(cols + rows - 2) * rows * cols,
      4,
      40,
      true
    );

    points.push(
      new Point({
        color: parameters.fg,
        x,
        y,
        size,
      })
    );
  }

  for (let i = 0; i < points.length; i++) {
    const bin = random.value() < 0.76 ? random.rangeFloor(4, 64) : 0;
    bins.push(bin);
  }

  return ({ context: ctx, width, height, frame }) => {
    ctx.fillStyle = parameters.bg;
    ctx.fillRect(0, 0, width, height);

    if (!audioPlayer || !audioPlayer.context) {
      return;
    }
    audioPlayer.getFloatFrequencyData();

    ctx.save();
    ctx.translate(mx, my);
    ctx.translate(cw / 2, ch / 2);
    ctx.lineWidth = 4;

    const f = frame;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const n = random.noise3D(
        p.x,
        p.y,
        (f % Number.MAX_SAFE_INTEGER) * 10,
        parameters.frequency,
        parameters.amplitude
      );
      const size = math.mapRange(
        audioPlayer.audioData[bins[i]],
        audioPlayer.minDb,
        audioPlayer.maxDb,
        p.initialSize * 0.3,
        p.initialSize * 0.6,
        true
      );

      p.size =
        size *
        (1.5 -
          math.mapRange(
            n,
            -parameters.amplitude,
            parameters.amplitude,
            0.2,
            1.5
          ));
      p.x = p.initialX + n;
      p.y = p.initialY + n;

      if (size > p.initialSize * 0.4 && size < p.initialSize * 0.48) {
        p.color = parameters.bg;
      } else if (size >= p.initialSize * 0.53) {
        p.color = 'red';
      } else {
        p.color = p.initialColor;
      }

      p.draw(ctx);
    }

    ctx.restore();
  };
};

const onMouseUp = () => {
  if (!audioPlayer || !audioPlayer.context) {
    audioPlayer = new AudioPlayer({
      filename: '../assets/04.mp3',
      settings: {
        fftSize: 512,
        smoothingTimeConstant: 0.9,
      },
    });
  }

  if (audioPlayer.audioElement.paused) {
    audioPlayer.play();
    if (manager) manager.play();
  } else {
    audioPlayer.pause();
    if (manager) manager.pause();
  }
};

const addListeners = () => {
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('touchstart', onMouseUp);
};

const start = async () => {
  addListeners();
  manager = await canvasSketch(sketch, settings);
};

start();
