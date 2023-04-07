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
  smoothingTimeConstant: 0.9,
};

const easingFunction = eases.quadIn;

let manager;
let audio;
let audioCtx, audioData, sourceNode, analyserNode;
let minDb, maxDb;

const sketch = () => {
  const circles = 5;
  const slices = 9;
  const slice = (Math.PI * 2) / slices;
  const radius = 200;

  const bins = [];
  const lineWidths = [];
  for (let i = 0; i < circles * slices; i++) {
    const bin = random.value() < 0.76 ? random.rangeFloor(4, 64) : 0;
    bins.push(bin);
  }
  for (let i = 0; i < circles; i++) {
    const t = i / (circles - 1);
    lineWidths.push(easingFunction(t) * 200 + 20);
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

    let incrementalRadius = radius;

    for (let i = 0; i < circles; i++) {
      let lineWidth = 0;
      ctx.save();

      for (let j = 0; j < slices; j++) {
        const bin = bins[i * slices + j];
        if (bin === 0) {
          continue;
        }

        const mappedAudioValue = math.mapRange(
          audioData[bin],
          minDb,
          maxDb,
          0,
          1,
          true
        );
        lineWidth = lineWidths[i] * mappedAudioValue;

        if (lineWidth < 1) {
          continue;
        }

        ctx.lineWidth = lineWidth;
        ctx.rotate(slice);
        ctx.beginPath();
        ctx.arc(0, 0, incrementalRadius + lineWidth / 2, 0, slice);
        ctx.stroke();
      }

      incrementalRadius += lineWidth;
      ctx.restore();
    }

    ctx.restore();

    return;
    // for (let bin of bins) {
    //   const mappedBin = math.mapRange(
    //     audioData[bin],
    //     analyserNode.minDecibels,
    //     analyserNode.maxDecibels,
    //     0,
    //     1,
    //     true
    //   );
    //   const radius = mappedBin * 300;
    //
    //   ctx.save();
    //   ctx.translate(width / 2, height / 2);
    //   ctx.lineWidth = 10;
    //   ctx.beginPath();
    //   ctx.arc(0, 0, radius, 0, Math.PI * 2);
    //   ctx.stroke();
    //   ctx.restore();
    // }
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
