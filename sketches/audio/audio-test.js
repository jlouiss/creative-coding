const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const eases = require('eases');
const { Rhombus } = require('../classes/rhombus');
const { AudioPlayer } = require('../classes/audio-player');

let manager;
let audioPlayer;

const seed = random.getRandomSeed();
const settings = {
  dimensions: [1512, 1080],
  animate: true,
  name: seed,
};

class State {
  constructor({ height, width, parameters }) {
    this.height = height;
    this.width = width;
    this.parameters = parameters;
    this.setupVariables();
    this.additionalSetup();
    document.querySelector('canvas').style.boxShadow =
      '0px 0px 200px 0 rgba(255, 255, 255, .2)';
    document.querySelector('body').style.background = 'black';
  }

  setupVariables() {
    this.cols = this.parameters.cols;
    this.rows = this.parameters.rows;
    this.easingFunction = this.parameters.easingFunction;
    this.gw = this.width * this.parameters.gridWidthScale;
    this.gh = this.height * this.parameters.gridHeightScale;
    this.cw = this.gw / this.cols;
    this.ch = this.gh / this.rows;
    this.mx = (this.width - this.gw) / 2;
    this.my = (this.height - this.gh) / 2;
  }

  additionalSetup() {
    this.rhombuses = [];
    this.bins = [];

    for (let i = 0; i < this.rows * this.cols; i++) {
      if (i % 2 === 0 && i % this.cols !== 0 && (i - 1) % this.cols !== 0) {
        let x = math.mapRange(
          -this.easingFunction(i % this.cols),
          -this.easingFunction(this.cols - 1),
          -this.easingFunction(2),
          this.cw,
          this.gw - this.cw / 2,
          true
        );
        let xScale = math.mapRange(
          -this.easingFunction(i % this.cols),
          -this.easingFunction(this.cols - 1),
          -this.easingFunction(2),
          5,
          0.5,
          true
        );
        let y = Math.floor(i / this.cols) * this.ch;

        this.rhombuses.push(
          new Rhombus({
            color: this.parameters.fg,
            x,
            y,
            size: this.ch / 2,
            xScale,
            scaleXPositive: random.boolean(),
            scaleYPositive: random.boolean(),
          })
        );
      } else {
        continue;
      }
    }

    for (let i = 0; i < this.rhombuses.length; i++) {
      const bin = random.value() < 0.76 ? random.rangeFloor(4, 64) : 0;
      this.bins.push(bin);
    }
  }

  getRenderFunction() {
    return ({ context: ctx, width, height, frame }) => {
      ctx.fillStyle = this.parameters.bg;
      ctx.fillRect(0, 0, width, height);

      if (!audioPlayer || !audioPlayer.context) {
        return;
      }

      // can't add to .initialize() - i guess because `manager` doesn't exist
      audioPlayer.getFloatFrequencyData();

      ctx.save();
      ctx.translate(this.mx, this.my);
      ctx.translate(this.cw / 2, this.ch / 2);
      ctx.lineWidth = 4;

      for (let i = 0; i < this.rhombuses.length; i++) {
        const r = this.rhombuses[i];
        const xNoise = math.mapRange(
          audioPlayer.audioData[this.bins[i]],
          audioPlayer.minDb,
          audioPlayer.maxDb,
          -2,
          4,
          true
        );
        const xScaleNoise = math.mapRange(
          audioPlayer.audioData[this.bins[i]],
          audioPlayer.minDb,
          audioPlayer.maxDb,
          r.initialXScale * 0.02,
          r.initialXScale * 0.15,
          true
        );
        const yScaleNoise = math.mapRange(
          audioPlayer.audioData[this.bins[i]],
          audioPlayer.minDb,
          audioPlayer.maxDb,
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
  }
}

const sketch = ({ height, width }) => {
  const state = new State({
    height,
    width,
    parameters: {
      bg: '#0f0f0f',
      fg: '#ececec',
      cols: 13,
      rows: 15,
      gridHeightScale: 0.8,
      gridWidthScale: 0.9,
      easingFunction: eases.quadIn,
    },
  });
  return state.getRenderFunction();
};

const onMouseUp = () => {
  if (!audioPlayer || !audioPlayer.context) {
    audioPlayer = new AudioPlayer({
      filename: '../assets/02.mp3',
      settings: {
        fftSize: 512,
        smoothingTimeConstant: 0.65,
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
