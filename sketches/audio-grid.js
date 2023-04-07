const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const { Rhombus } = require('./audio-grid/rhombus');
const eases = require('eases');

const seed = random.getRandomSeed();
const settings = {
  dimensions: [1512, 1080],
  animate: true,
  name: seed,
};

const analyserSettings = {
  fftSize: 512,
  smoothingTimeConstant: 0.65,
};

const parameters = {
  bg: '#0f0f0f',
  fg: '#ececec',
  cols: 13,
  rows: 15,
  gridHeightScale: 0.8,
  gridWidthScale: 0.9,
  easingFunction: eases.quadOut,
};

let manager;
let audio;
let audioCtx, audioData, sourceNode, analyserNode;
let minDb, maxDb;

const sketch = ({ height, width }) => {
  const cols = parameters.cols;
  const rows = parameters.rows;
  const easingFunction = parameters.easingFunction;
  const gw = width * parameters.gridWidthScale;
  const gh = height * parameters.gridHeightScale;
  const cw = gw / cols;
  const ch = gh / rows;
  const mx = (width - gw) / 2;
  const my = (height - gh) / 2;
  const frequency = random.range(0.0009, 0.0022);
  const amplitude = random.range(2, 10);
  const rhombuses = [];
  let bins = [];

  document.querySelector('canvas').style.boxShadow =
    '0px 0px 200px 0 rgba(255, 255, 255, .2)';
  document.querySelector('body').style.background = 'black';

  for (let i = 0; i < rows * cols; i++) {
    if (i % 2 === 0 && i % cols !== 0 && (i - 1) % cols !== 0) {
      let x = math.mapRange(
        -easingFunction(i % cols) * cw,
        -easingFunction(cols) * cw,
        0,
        -cw,
        gw - cw * 0.9,
        true
      );
      let xScale = math.mapRange(
        -easingFunction(i % cols) * cw,
        -easingFunction(cols) * cw,
        0,
        5,
        0.5,
        true
      );
      let y = Math.floor(i / cols) * ch;

      rhombuses.push(
        new Rhombus({
          color: parameters.fg,
          x,
          y,
          size: ch / 2,
          xScale,
          scaleXPositive: random.boolean(),
          scaleYPositive: random.boolean(),
        })
      );
    } else {
      continue;
    }
  }
  for (let i = 0; i < rhombuses.length; i++) {
    const bin = random.value() < 0.76 ? random.rangeFloor(4, 64) : 0;
    bins.push(bin);
  }

  return ({ context: ctx, width, height, frame }) => {
    ctx.fillStyle = parameters.bg;
    ctx.fillRect(0, 0, width, height);

    if (!audioCtx) {
      return;
    }
    analyserNode.getFloatFrequencyData(audioData);

    ctx.save();
    ctx.translate(mx, my);
    ctx.translate(cw / 2, ch / 2);
    ctx.lineWidth = 4;

    for (let i = 0; i < rhombuses.length; i++) {
      const r = rhombuses[i];
      const xNoise = math.mapRange(
        audioData[bins[i]],
        minDb,
        maxDb,
        -2,
        4,
        true
      );
      const xScaleNoise = math.mapRange(
        audioData[bins[i]],
        minDb,
        maxDb,
        r.initialXScale * 0.02,
        r.initialXScale * 0.15,
        true
      );
      const yScaleNoise = math.mapRange(
        audioData[bins[i]],
        minDb,
        maxDb,
        -r.initialYScale * 0.03,
        r.initialYScale * 0.6,
        true
      );

      r.x = r.initialX + xNoise * (r.scaleXPositive ? 1 : -1);
      r.xScale = r.initialXScale + xScaleNoise * (r.scaleXPositive ? 1 : -1);
      r.yScale = r.initialYScale - yScaleNoise;

      r.draw(ctx);
    }

    ctx.restore();
  };
};

const setupAudio = () => {
  audio = document.createElement('audio');
  audio.src = 'audio/02.mp3';

  audioCtx = new AudioContext();

  sourceNode = audioCtx.createMediaElementSource(audio);
  sourceNode.connect(audioCtx.destination);

  analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = analyserSettings.fftSize;
  analyserNode.smoothingTimeConstant = analyserSettings.smoothingTimeConstant;
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);
};

const onMouseUp = () => {
  if (!audioCtx) {
    setupAudio();
  }

  if (audio.paused) {
    audio.play();
    manager.play();
  } else {
    audio.pause();
    manager.pause();
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
