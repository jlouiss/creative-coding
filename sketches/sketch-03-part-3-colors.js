import { Agent } from './agent-part-3-colors';
import { canvasSketch } from 'canvas-sketch';
import { math, random } from 'canvas-sketch-util';
import { randomColorScheme } from './color-schemes';

const settings = {
  animate: true,
  dimensions: [1080, 1080],
};
const BASE_COLOR_SCEME = randomColorScheme;
const AGENTS_AMOUNT = random.range(30, 50);
const BACKGROUND_COLOR = random.pick(BASE_COLOR_SCEME);
const COLORS = BASE_COLOR_SCEME.filter((c) => c !== BACKGROUND_COLOR);
const DRAW_LINE_THRESHOLD = random.range(160, 280);

const sketch = ({ context: ctx, width: w, height: h }) => {
  document.querySelector('body').style.background = random.pick(COLORS);

  const agents = [];
  for (let i = 0; i < AGENTS_AMOUNT; i++) {
    const color = random.pick(COLORS);
    agents.push(
      new Agent({
        x: random.range(w * 0.05, w * 0.95),
        y: random.range(h * 0.05, h * 0.95),
        radius: random.range(1, 4) * 3,
        color,
        strokeColor: random.pick(COLORS.filter((c) => c !== color)),
      })
    );
  }

  return () => {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const b = agents[j];
        const distance = a.position.getDistance(b.position);

        if (distance > DRAW_LINE_THRESHOLD) continue;

        // randomize line thickness based on distance
        ctx.strokeStyle = a.strokeColor;
        ctx.lineWidth = math.mapRange(distance, 0, DRAW_LINE_THRESHOLD, 4, 1.5);

        ctx.beginPath();
        // cool : ax => ay; by => bx
        ctx.moveTo(a.position.x, a.position.y);
        ctx.lineTo(b.position.x, b.position.y);
        ctx.stroke();
      }
    }

    agents.forEach((agent) => {
      agent.update();
      agent.draw(ctx);
      agent.bounce(w, h);
    });
  };
};

canvasSketch(sketch, settings);
