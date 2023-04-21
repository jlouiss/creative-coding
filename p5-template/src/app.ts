import P5 from 'p5';
// import "p5/lib/addons/p5.sound";	// Include if needed
import './styles.scss';

class MyCircle {
  constructor(
    private readonly p5: P5,
    private position: P5.Vector,
    private size: number
  ) {}

  draw() {
    this.p5.push();

    this.p5.translate(this.position);
    this.p5.noStroke();
    this.p5.fill('orange');
    this.p5.ellipse(0, 0, this.size);

    this.p5.pop();
  }
}

const sketch = (p5: P5) => {
  const myCircles: MyCircle[] = [];

  p5.setup = () => {
    const canvas = p5.createCanvas(200, 200);
    canvas.parent('app');
    p5.background('black');

    for (let i = 1; i < 4; i++) {
      const p = p5.width / 4;
      const circlePos = p5.createVector(p * i, p5.height / 2);
      const size = i % 2 !== 0 ? 24 : 32;
      myCircles.push(new MyCircle(p5, circlePos, size));
    }
  };

  p5.draw = () => {
    myCircles.forEach((circle) => circle.draw());
  };
};

new P5(sketch);
