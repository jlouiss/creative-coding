import { Agent } from './agent-static';
import { canvasSketch } from 'canvas-sketch';
import { random } from 'canvas-sketch-util';

const { range } = random;

const settings = {
  dimensions: [1080, 1080],
};

const sketch = ({ context: ctx, width: w, height: h }) => {
  const agents = [];
  for (let i = 0; i < 150; i++) {
    const x = range(w * 0.1, w * 0.9);
    const y = range(h * 0.1, h * 0.9);
    const radius = range(10, range(0.6, 1.2) * range(1, 100));
    const color = `rgba(
      ${range(0, 120)},
      ${range(40, 80)},
      ${range(80, 120)},
      ${range(0.8, 1)}
    )`;

    agents.push(new Agent({ x, y, radius, color }));
  }

  return () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    agents.forEach((agent) => agent.draw(ctx));
  };
};

canvasSketch(sketch, settings);
