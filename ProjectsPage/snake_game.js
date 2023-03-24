const canvas = document.getElementById('snake-game');
const context = canvas.getContext('2d');
const gridSize = 20;
const snakeSpeed = 100;
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let dx = gridSize;
let dy = 0;
let food = { x: gridSize * 10, y: gridSize * 10 };
let gameState = "start";

function update() {
  if (gameState === "start" || gameState === "gameover") {
    return;
  }

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    placeFood();
  } else {
    snake.pop();
  }

  if (collision(head)) {
    gameState = "gameover";
    return;
  }

  setTimeout(() => {
    requestAnimationFrame(update);
  }, snakeSpeed);
}

function draw() {
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState === "start") {
    drawText("Press SPACE to Start", "20px Arial", "black", canvas.width / 2, canvas.height / 2);
  } else if (gameState === "gameover") {
    drawText("Game Over", "20px Arial", "black", canvas.width / 2, canvas.height / 2);
    drawText("Press SPACE to Restart", "20px Arial", "black", canvas.width / 2, canvas.height / 2 + 30);
  }

  context.fillStyle = 'green';
  snake.forEach(({ x, y }) => {
    context.fillRect(x, y, gridSize, gridSize);
  });

  context.fillStyle = 'red';
  context.fillRect(food.x, food.y, gridSize, gridSize);

  requestAnimationFrame(draw);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
    y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize,
  };
}

function drawText(text, font, color, x, y) {
  context.font = font;
  context.fillStyle = color;
  context.textAlign = "center";
  context.fillText(text, x, y);
}

function collision(head) {
  return (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake.slice(1).some(({ x, y }) => x === head.x && y === head.y)
  );
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (gameState === "start" || gameState === "gameover") {
      startGame();
    }
  } else {
    if (event.key === 'ArrowUp' && dy === 0) {
      dx = 0;
      dy = -gridSize;
    } else if (event.key === 'ArrowDown' && dy === 0) {
      dx = 0;
      dy = gridSize;
    } else if (event.key === 'ArrowLeft' && dx === 0) {
      dx = -gridSize;
      dy = 0;
    } else if (event.key === 'ArrowRight' && dx === 0) {
      dx = gridSize;
      dy = 0;
}
  }
});

function startGame() {
  gameState = "playing";
  snake = [{ x: gridSize * 5, y: gridSize * 5 }];
  dx = gridSize;
  dy = 0;
  placeFood();
}

update();
draw();
