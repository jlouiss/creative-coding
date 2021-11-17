import { Agent } from './agent';
import { canvasSketch } from 'canvas-sketch';
import { random } from 'canvas-sketch-util';
import { randomColorScheme } from './color-schemes';

const AGENTS_AMOUNT = 250;
const settings = {
  animate: true,
};
const BACKGROUND_COLOR = random.pick(randomColorScheme);
const COLORS = randomColorScheme.filter(c => c !== BACKGROUND_COLOR);

const sketch = ({ context: ctx, width: w, height: h }) => {
  const agents = [];
  for (let i = 0; i < AGENTS_AMOUNT; i++) {
    const x = random.range(w * 0.1, w * 0.9);
    const y = random.range(h * 0.1, h * 0.9);
    const radius = random.range(10, random.range(0.6, 1.2) * random.range(1, 100));
    agents.push(new Agent({ x, y, radius, color: random.pick(COLORS) }));
  }

  return () => {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, w, h);
    agents.forEach((agent) => {
      agent.update();
      agent.draw(ctx);
      agent.bounce(w, h);
    });
  };
};

canvasSketch(sketch, settings);
