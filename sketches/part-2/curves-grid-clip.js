const canvasSketch = require('canvas-sketch');
const { Point } = require('./point');
const risoColors = require('riso-colors');
const colormap = require('colormap');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const colormapKeys = ['jet', 'hsv', 'hot', 'spring', 'summer', 'autumn', 'winter', 'bone', 'copper', 'greys', 'yignbu', 'greens', 'yiorrd', 'bluered', 'rdbu', 'picnic', 'rainbow', 'portland', 'blackbody', 'earth', 'electric', 'alpha', 'viridis', 'inferno', 'magma', 'plasma', 'warm', 'cool', 'rainbow-soft', 'bathymetry', 'cdom', 'chlorophyll', 'density', 'freesurface-blue', 'freesurface-red', 'oxygen', 'par', 'phase', 'salinity', 'temperature', 'turbidity', 'velocity-blue', 'velocity-green', 'cubehelix'];

const seed = random.getRandomSeed();
const settings = {
  dimensions: [1080, 1080],
  name: seed,
  animate: true,
};

random.setSeed(seed);
const columns = 9;
const rows = 48;
const cells = columns * rows;
const defaultColor = random.pick(risoColors).hex;
const magicNumber = 400;

let points = [];

const sketch = ({ width, height }) => {
  const gw = width * 0.9;
  const gh = height * 0.9;
  const cw = gw / columns;
  const ch = gh / rows;
  const mx = (width - gw) / 2;
  const my = (height - gh) / 2;

  // const noiseFrequency = 0.0018;
  // const noiseAmplitude = 90;
  const frequency = random.range(0.0009, 0.0022);
  const amplitude = random.range(80, 140);

  const colors = colormap({
    colormap: random.pick(colormapKeys),
    nshades: amplitude,
  })
  const colorIndex = Math.floor(colors.length / 10);
  const bg = colors[colorIndex];
  document.querySelector('canvas').style.boxShadow =
    '0px 0px 200px 0 rgba(255, 255, 255, .2)';
  document.querySelector('body').style.background = 'black';

  const mask = {
    radius: width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.58,
  };


  for (let i = 0; i < cells; i++) {
    let x = (i % columns) * cw;
    let y = Math.floor(i / columns) * ch;
    const noise = random.noise2D(x, y, frequency, amplitude);
    // x += noise;
    // y += noise;

    const lineWidth = math.mapRange(noise, -amplitude, amplitude, 0, 5);
    const color = colors[Math.floor(math.mapRange(noise, -amplitude, amplitude, 0, amplitude))];

    points.push(new Point({ x, y, lineWidth, color }));
  }

  return ({ context: ctx, width, height, frame }) => {
    // ctx.fillStyle = colors[colorIndex];
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(mask.x, mask.y);

    drawPolygon({ ctx, radius: mask.radius, sides: mask.sides });

    ctx.clip();

    ctx.translate(-mask.x, -mask.y);

    ctx.save();
    ctx.translate(mx, my);
    ctx.translate(cw / 2, ch / 2);
    ctx.strokeStyle = defaultColor;
    ctx.lineWidth = 4;

    points.forEach(point => {
      const noise = random.noise2D(point.initialX + frame * 1.7, point.initialY - frame * 2.2, frequency, amplitude);
      point.x = point.initialX + noise;
      point.y = point.initialY + noise;
    })

    for (let r = 0; r < rows; r++) {
      let lastx, lasty;
      for (let c = 0; c < columns - 1; c++) {
        const current = points[r * columns + c];
        const next = points[r * columns + c + 1];
        const mx = current.x + (next.x - current.x) / 2;
        const my = current.y + (next.y - current.y) / 2;

        // single quadratic line
        // if (c === 0) {
        //   ctx.moveTo(current.x, current.y);
        // } else if (c === columns - 2) {
        //   ctx.quadraticCurveTo(current.x, current.y, next.x, next.y);
        // } else {
        //   ctx.quadraticCurveTo(current.x, current.y, mx, my);
        // }

        if (c === 0) {
          lastx = current.x - c / columns * magicNumber;
          lasty = current.y - r / rows * magicNumber;
        }

        // quadratic segments
        ctx.beginPath();
        ctx.lineWidth = current.lineWidth;
        ctx.strokeStyle = current.color;
        ctx.moveTo(lastx, lasty);
        ctx.quadraticCurveTo(current.x, current.y, mx, my);
        ctx.stroke();

        lastx = mx - c / columns * magicNumber;
        lasty = my - r / rows * magicNumber;
      }
    }

    // points.forEach((p) => p.draw(ctx));
    ctx.restore();


    ctx.save();
    ctx.translate(mask.x, mask.y);
    ctx.lineWidth = 4;

    drawPolygon({ ctx, radius: mask.radius - ctx.lineWidth, sides: mask.sides });

    // ctx.globalCompositeOperation = 'color-burn';
    ctx.strokeStyle = 'white';
    ctx.stroke();

    // drawPolygon({ ctx, radius: mask.radius + ctx.lineWidth / 2, sides: mask.sides });
    //
    // ctx.lineWidth = 60;
    // // ctx.globalCompositeOperation = 'source-over';
    // ctx.strokeStyle = colors[1].hex;
    // ctx.stroke();

    ctx.restore();
  };
};

const drawPolygon = ({ ctx, radius = 600, sides = 3 }) => {
  const slice = (Math.PI * 2) / sides;

  ctx.beginPath();
  ctx.moveTo(0, -radius);

  for (let i = 0; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5;
    ctx.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }

  ctx.closePath();
};

canvasSketch(sketch, settings);
