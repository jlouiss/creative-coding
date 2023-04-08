const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const csuColor = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

const seed = random.getRandomSeed();
console.log(seed);

const settings = {
  animate: true,
  dimensions: [2048, 2048],
  name: seed,
};

const sketch = ({ context: ctx, width, height }) => {
  random.setSeed(seed);
  const num = 100;
  const deg = random.range(-20, 60);
  const rectangles = [];
  const colors = [random.pick(risoColors), random.pick(risoColors)];

  const bg = random.pick(risoColors).hex;

  const mask = {
    radius: width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.58,
  };

  for (let i = 0; i < num; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    const w = random.range(400, width);
    const h = random.range(80, 400);
    const fill = random.pick(colors).hex;
    const stroke = random.pick(colors).hex;
    const blend = random.boolean() ? 'overlay' : 'source-over';
    rectangles.push({ x, y, w, h, fill, stroke, blend });
  }

  return ({ context: ctx, width, height }) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(mask.x, mask.y);

    drawPolygon({ ctx, radius: mask.radius, sides: mask.sides });

    ctx.clip();

    rectangles.forEach(({ x, y, w, h, fill, stroke, blend }) => {
      const shadowColor = csuColor.offsetHSL(fill, 0, 0, -20);
      ctx.save();
      ctx.translate(-mask.x, -mask.y);
      ctx.translate(x, y);
      ctx.strokeStyle = stroke;
      ctx.fillStyle = fill;
      // ctx.lineWidth = random.range(10, 40);
      ctx.lineWidth = 30;
      ctx.globalCompositeOperation = blend;

      drawSkewedRect({ ctx, x, h, deg });

      ctx.shadowColor = csuColor.style(shadowColor.rgba);
      ctx.shadowOffsetX = -10;
      ctx.shadowOffsetY = 20;

      ctx.fill();

      ctx.shadowColor = null;
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.restore();
    });

    ctx.restore();

    ctx.save();
    ctx.translate(mask.x, mask.y);
    ctx.lineWidth = 60;

    drawPolygon({ ctx, radius: mask.radius - ctx.lineWidth, sides: mask.sides });

    ctx.globalCompositeOperation = 'color-burn';
    ctx.strokeStyle = colors[0].hex;
    ctx.stroke();

    drawPolygon({ ctx, radius: mask.radius + ctx.lineWidth / 2, sides: mask.sides });

    ctx.lineWidth = 60;
    // ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = colors[1].hex;
    ctx.stroke();

    ctx.restore();
  };
};

const drawSkewedRect = ({ ctx, w = 1200, h = 400, deg = -45 }) => {
  const angle = math.degToRad(deg);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  ctx.save();
  ctx.translate(rx * -0.5, (ry + h) * -0.5);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(rx, ry);
  ctx.lineTo(rx, ry + h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.restore();
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
