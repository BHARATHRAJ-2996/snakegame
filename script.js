const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

let box = 20;
let score = 0;
let energy = 100; // Your "Must Collect" logic
let snake = [{ x: 10 * box, y: 10 * box }];
let stone = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};
let d;

// Listen for keyboard controls
document.addEventListener("keydown", direction);

function direction(event) {
    if(event.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if(event.keyCode == 38 && d != "DOWN") d = "UP";
    else if(event.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if(event.keyCode == 40 && d != "UP") d = "DOWN";
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the Snake
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#4cc9f0" : "#4361ee";
        ctx.strokeStyle = "#000";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the "Stone"
    ctx.fillStyle = "#f72585";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#f72585";
    ctx.fillRect(stone.x, stone.y, box, box);
    ctx.shadowBlur = 0; // Reset glow

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;

    // Stone Collection Logic
    if(snakeX == stone.x && snakeY == stone.y) {
        score++;
        energy = 100; // Reset the energy when a stone is collected
        scoreDisplay.innerText = score;
        stone = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        // Snake grows because we don't pop the tail
    } else {
        snake.pop(); // Remove tail to keep same size
        energy -= 0.6; // Energy drains over time
    }

    timerDisplay.innerText = Math.max(0, Math.floor(energy));

    let newHead = { x: snakeX, y: snakeY };

    // GAME OVER CONDITIONS
    if(snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || energy <= 0 || collision(newHead, snake)) {
        clearInterval(game);
        alert("GAME OVER! 🐍\nStones Collected: " + score + "\n" + (energy <= 0 ? "You ran out of energy!" : "You hit something!"));
        location.reload();
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

document.getElementById("restartBtn").addEventListener("click", () => location.reload());

// Run the game loop
let game = setInterval(draw, 100);