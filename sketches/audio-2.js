const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const eases = require('eases');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const analyserSettings = {
  fftSize: 512,
  smoothingTimeConstant: 0.92,
};

const easingFunction = eases.quadIn;

let manager;
let audio;
let audioCtx, audioData, sourceNode, analyserNode;
let minDb, maxDb;

const sketch = () => {
  const circles = 5;
  const slices = 1;
  const slice = (Math.PI * 2) / slices;
  const radius = 200;

  const bins = [];
  const lineWidths = [];
  const rotationOffsets = [];

  for (let i = 0; i < circles * slices; i++) {
    const bin = random.rangeFloor(4, 64);
    bins.push(bin);
  }
  for (let i = 0; i < circles; i++) {
    const t = i / (circles - 1);
    lineWidths.push(easingFunction(t) * 200 + 10);
  }
  for (let i = 0; i < circles; i++) {
    rotationOffsets.push(random.range(-Math.PI / 4, Math.PI / 4) - Math.PI / 2)
  }

  return ({ context: ctx, width, height }) => {
    ctx.fillStyle = '#eeeae0';
    ctx.fillRect(0, 0, width, height);

    if (!audioCtx) {
      return;
    }
    analyserNode.getFloatFrequencyData(audioData);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(1, -1);

    let incrementalRadius = radius;

    for (let i = 0; i < circles; i++) {
      let lineWidth = lineWidths[i];
      ctx.save();
      ctx.rotate(rotationOffsets[i]);

      incrementalRadius += lineWidth / 2 + 2;

      for (let j = 0; j < slices; j++) {
        const bin = bins[i * slices + j];

        const mappedAudioValue = math.mapRange(
          audioData[bin],
          minDb,
          maxDb,
          0,
          1,
          true
        );

        const phi = slice * mappedAudioValue;

        ctx.rotate(slice);
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(0, 0, incrementalRadius, 0, phi);
        ctx.stroke();
      }

      incrementalRadius += lineWidth / 2;
      ctx.restore();
    }

    ctx.restore();
  };
};

const setupAudio = () => {
  audio = document.createElement('audio');
  audio.src = 'audio/01.mp3';

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

  console.group('setup audio');
  console.group('context');
  console.log(audioCtx);
  console.groupEnd();
  console.group('source node');
  console.log(sourceNode);
  console.groupEnd();
  console.group('analyser node');
  console.log(analyserNode);
  console.groupEnd();
  console.group('audio data');
  console.log(audioData);
  console.groupEnd();
  console.groupEnd();
};

const addListeners = () => {
  window.addEventListener('mouseup', () => {
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
  });
};

const start = async () => {
  addListeners();
  manager = await canvasSketch(sketch, settings);
};

start();
