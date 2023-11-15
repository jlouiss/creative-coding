import canvasSketch from 'canvas-sketch';
import { math, random } from 'canvas-sketch-util';
import eases from 'eases';
import { CircleGridPoint } from '../classes/circle-grid-point';
import { AudioPlayer } from '../classes/audio-player';

let manager;
let audioPlayer;

const seed = random.getRandomSeed();
const settings = {
  dimensions: [2048, 2048],
  animate: true,
  name: seed,
};

const parameters = {
  amplitude: 5.6,
  bg: '#0f0f0f',
  fg: '#ececec',
  ballFrequency: 0.002,
  frequency: 0.003,
  cols: 64,
  rows: 64,
  gridHeightScale: 0.84,
  gridWidthScale: 0.84,
  easingFunctionX: eases.linear,
  easingFunctionY: eases.linear,
  colorMult: 1.15,
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
  const ballBoundaries = {
    xMin: mx + cw * 6,
    xMax: gw - cw * 6,
    yMin: my + ch * 6,
    yMax: gh - ch * 6,
  };

  let ball;
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
      20,
      true
    );

    points.push(
      new CircleGridPoint({
        color: parameters.fg,
        x,
        y,
        size,
      })
    );
  }

  // ball = new CircleGridPoint({
  //   x: random.rangeFloor(ballBoundaries.xMin, ballBoundaries.xMax),
  //   y: random.rangeFloor(ballBoundaries.yMin, ballBoundaries.yMax),
  //   size: 0.2,
  //   dampening: 1.4,
  // });

  for (let i = 0; i < points.length; i++) {
    const bin = random.value() < 0.76 ? random.rangeFloor(4, 64) : 0;
    bins.push(bin);
  }

  return ({ context: ctx, width, height, frame: f }) => {
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

    if (ball) {
      const n = random.noise3D(
        ball.x,
        ball.y,
        (f % Number.MAX_SAFE_INTEGER) * 10,
        parameters.frequency,
        parameters.amplitude
      );
      ball.ax = Math.cos(n * Math.PI * 2);
      ball.ay = Math.sin(n * Math.PI * 2);
      ball.vx += ball.ax * 2;
      ball.vy += ball.ay * 2;
      ball.vx *= ball.dampening;
      ball.vy *= ball.dampening;

      if (ball.x < ballBoundaries.xMin || ball.x > ballBoundaries.xMax) {
        ball.vx *= -2.2;
      }

      if (ball.y < ballBoundaries.yMin || ball.y > ballBoundaries.yMax) {
        ball.vy *= -2.2;
      }

      ball.x += ball.vx;
      ball.y += ball.vy;
    }

    // points.sort();
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
        p.initialSize * 0.2 * Math.abs(n) + 1.4,
        p.initialSize * 0.3 * Math.abs(n),
        true
      );
      const amplitude = math.mapRange(
        audioPlayer.audioData[bins[i]],
        audioPlayer.minDb,
        audioPlayer.maxDb,
        0,
        1,
        true
      );

      p.size = size;
        // size *
        // (1 -
        //   math.mapRange(
        //     n,
        //     -parameters.amplitude,
        //     parameters.amplitude,
        //     0,
        //     0.8
        //   ));
      p.x = p.initialX + n + amplitude * 127;
      p.y = p.initialY + n - amplitude * 200;

      if (
        amplitude * parameters.colorMult > p.initialSize * 0.4 &&
        amplitude * parameters.colorMult < p.initialSize * 0.48
      ) {
        continue;
      } else if (amplitude * parameters.colorMult >= p.initialSize * 0.15) {
        p.color = 'red';
      } else {
        p.color = p.initialColor;
      }

      p.update();
      p.draw(ctx);
    }

    ctx.restore();
  };
};

const onMouseUp = () => {
  if (!audioPlayer || !audioPlayer.context) {
    audioPlayer = new AudioPlayer({
      filename: '../assets/06.mp3',
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
