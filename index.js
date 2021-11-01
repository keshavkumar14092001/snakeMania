const gameOverSound = new Audio('./music/gameover.mp3');
const eatSound = new Audio('./music/food.mp3');
const gamePauseSound = new Audio('./music/gamepause.mp3');
const moveSound = new Audio('./music/move.mp3');
let position = { x: 0, y: 0 };
let foodPostion = { x: 5, y: 5 };
let snake = [{ x: 8, y: 8 }];
const gamingBoard = document.querySelector('.gameContainer');
let lastRenderedTime = 0;
let speed = 5;
let score = 0;

// Game Main Logic:
window.addEventListener('keydown', pressedKey);
window.requestAnimationFrame(main);

// HighScore Logic:
let high_Score = localStorage.getItem('highscore');
if (high_Score === null) {
    let highscoreval = 0;
    localStorage.setItem('highscore', JSON.stringify(highscoreval));
}
else {
    let high_Score = JSON.parse(high_Score);
    let high = document.getElementById('HighScore');
    high.innerHTML = "HighScore: " + high_Score;
}

// Game Loop:
function main(currentTime) {
    window.requestAnimationFrame(main);
    if (((currentTime - lastRenderedTime) / 1000) < 1 / speed) {
        return;
    }
    lastRenderedTime = currentTime;
    gameEngine();
}

// Game Engine:
function gameEngine() {


    // Logic when snake Bumps into wall or itself:
    if (isSnakeCollided(snake)) {
        gameOverSound.play();
        alert("The Game Is Over");
        foodPostion = { x: 5, y: 5 };
        position = { x: 0, y: 0 };
        snake = [{ x: 8, y: 8 }];
        score = 0;
        let check = document.getElementById('Score');
        check.innerHTML = "Score: " + score;
        let high_Score = localStorage.getItem('highscore');
        if (high_Score > score) {
            high_Score = JSON.parse(high_Score);
            let high = document.getElementById('HighScore');
            high.innerHTML = "HighScore: " + high_Score;
        }
    }

    // Logic when snake eats:
    if (snake[0].x === foodPostion.x && snake[0].y === foodPostion.y) {
        eatSound.play();
        snake.unshift({ x: snake[0].x + position.x, y: snake[0].y + position.y })
        score += 1;
        let check = document.getElementById('Score');
        check.innerHTML = "Score: " + score;
        let a = 2;
        let b = 13;
        foodPostion = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        if (score > high_Score) {
            high_Score = score;
            localStorage.setItem('highscore', JSON.stringify(high_Score));
            let high = document.getElementById('HighScore');
            let final_score = JSON.parse(high_Score);
            high.innerHTML = "HighScore: " + final_score;
        }
    }

    // Logic when snake moves:
    for (let i = (snake.length - 2); i >= 0; i--) {
        snake[i + 1] = { ...snake[i] };
    }
    snake[0].x += position.x;
    snake[0].y += position.y;

    // Displaying the Snake and Food:
    gamingBoard.innerHTML = "";

    // Displaying the Food:
    let foodElement = document.createElement('div');
    foodElement.classList.add('snakeFood');
    foodElement.style.gridRowStart = foodPostion.y;
    foodElement.style.gridColumnStart = foodPostion.x;
    gamingBoard.appendChild(foodElement);

    // Displaying the Snake:
    snake.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('snakeHead');
        }
        else {
            snakeElement.classList.add('snakeBody');
        }
        gamingBoard.appendChild(snakeElement);
    });
}

// Pressed Key Game Function:
function pressedKey(event) {
    let pressed = event.key;
    // Start The Game:
    moveSound.play();
    position = { x: 0, y: 1 };
    switch (pressed) {
        case 'ArrowUp':
            position.x = 0;
            position.y = -1;
            break;
        case 'ArrowDown':
            position.x = 0;
            position.y = 1;
            break;
        case 'ArrowRight':
            position.x = 1;
            position.y = 0;
            break;
        case 'ArrowLeft':
            position.x = -1;
            position.y = 0;
            break;
        case ' ':
            gamePause();
            break;
        default:
            break;
    }
}

// Game Pause Logic:
function gamePause() {
    gamePauseSound.play();
    moveSound.pause();
    alert("The Game Is Paused");
}

// Snake Collided Function:
function isSnakeCollided(snake) {
    // Logic when snake collided with wall:
    if (snake[0].x >= 14 || snake[0].x <= 0 || snake[0].y >= 14 || snake[0].y <= 0) {
        return true;
    }
    // Logic when snake collided with itself:
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
}