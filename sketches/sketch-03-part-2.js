import { Agent } from './agent-part-2';
import { canvasSketch } from 'canvas-sketch';
import { random } from 'canvas-sketch-util';

const { range } = random;

const settings = {
  animate: true,
  dimensions: [1080, 1080],
};

const AGENTS_AMOUNT = 20;

const sketch = ({ context: ctx, width: w, height: h }) => {
  const agents = [];
  for (let i = 0; i < AGENTS_AMOUNT; i++) {
    const x = range(w * 0.05, w * 0.95);
    const y = range(h * 0.05, h * 0.95);
    const radius = range(4, 8);
    agents.push(new Agent({ x, y, radius }));
  }

  return () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];

      for (let j = 0; j < agents.length; j++) {
        const b = agents[j];

        ctx.beginPath();
        ctx.moveTo(a.position.x, b.position.y);
        ctx.lineTo(a.position.y, b.position.x);
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
