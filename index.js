const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

context.fillStyle = 'cyan';
// context.fillRect(100, 100, 400, 400);

context.lineWidth = 4;
// context.beginPath();
// context.rect(100, 100, 400, 400);
// context.stroke();
//
//
// context.beginPath();
// context.arc(300, 300, 100, 0, Math.PI * 2);
// context.stroke();


function init() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const height = 60;
  const width = 60;
  const gap = 20;

  for (let i = 0; i < 5; i++) {
    let x = 100 + (width + gap) * i;

    for (let j = 0; j < 5; j++) {
      let y = 100 + (height + gap) * j;

      context.beginPath();
      context.rect(x, y, width, height);
      context.stroke();

      if (Math.random() > 0.5) {
        context.beginPath();
        context.rect(x + 8, y + 8, width - 16, height - 16);
        context.stroke();
      }
    }
  }
}

init();
setInterval(init, 600);

