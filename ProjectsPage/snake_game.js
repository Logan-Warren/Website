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
    requestAnimationFrame(update);
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
  }

  setTimeout(() => {
    requestAnimationFrame(update);
  }, snakeSpeed);
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
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

update();
gameLoop();
