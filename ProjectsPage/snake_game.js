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

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  gameState = "playing";
  snake = [{ x: gridSize * 5, y: gridSize * 5 }];
  dx = gridSize;
  dy = 0;
  placeFood();
  update(); // Call update() here to start the game loop when the game state changes to "playing"
}

gameLoop(); // Call gameLoop() to start rendering the game
