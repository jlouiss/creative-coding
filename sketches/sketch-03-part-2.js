import { Agent } from './agent-part-2';
import { canvasSketch } from 'canvas-sketch';
import { math, random } from 'canvas-sketch-util';

const { range } = random;

const settings = {
  animate: true,
  dimensions: [1080, 1080],
};

const AGENTS_AMOUNT = random.range(30, 50);
const DRAW_LINE_THRESHOLD = random.range(160, 280);

const sketch = ({ context: ctx, width: w, height: h }) => {
  const agents = [];
  for (let i = 0; i < AGENTS_AMOUNT; i++) {
    const x = range(w * 0.05, w * 0.95);
    const y = range(h * 0.05, h * 0.95);
    const radius = range(1, 4) * 3;
    agents.push(new Agent({ x, y, radius }));
  }

  return () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const b = agents[j];
        const distance = a.position.getDistance(b.position);

        if (distance > DRAW_LINE_THRESHOLD) continue;

        // randomize line thickness based on distance
        ctx.lineWidth = math.mapRange(distance, 0, DRAW_LINE_THRESHOLD, 2.5, .1);

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
