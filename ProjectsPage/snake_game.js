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

function startGame() {
  gameState = "playing";
  snake = [{ x: gridSize * 5, y: gridSize * 5 }];
  dx = gridSize;
  dy = 0;
  placeFood();
  update(); // Call update() here to start the game loop when the game state changes to "playing"
}

update();
draw();
