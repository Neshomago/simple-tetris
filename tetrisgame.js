//Add sounds if necessary
//const hit = './assets/hit.wav';
//const line = './assets/line.wav';


const canvas = document.querySelector("#tetris-layout")
const ctx = canvas.getContext("2d");

const ROWS = 10;
const COLS = 5;
const BLOCK_SIZE = 20;

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

const EMPTY = 0;
const COLORS =
        ["#000000",
            "#FF0000",
            "#00FF00",
            "#0000FF",
            "#FFFF00",
            "#FF00FF",
            "#00FFFF",
            "#FFFFFF"];
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
let currentPiece = generatePiece();
let score = 0;
let level = 1;
let speed = 500;
// in milliseconds
let gameInterval;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece();
}


function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS;
            col++) {
            drawBlock(col,
                row,
                board[row][col]);
        }
    }
}

function drawPiece() {
    currentPiece.shape.forEach((row, i) => {
        row.forEach((value,
            j) => {
            if (value !== EMPTY) {
                drawBlock(currentPiece.x + j, currentPiece.y + i, currentPiece.color);
            }
        });
    });
}

function drawBlock(x, y, color) {
    ctx.fillStyle = COLORS[color];
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "#333";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function generatePiece() {
    const pieces = [
                {
                    shape: [[1, 1, 1, 1]],
                    color: 1
                },
                {
                    shape: [[1, 1, 1],
                        [1, 0, 0]],
                    color: 2
                },
                {
                    shape: [[1, 1, 1],
                        [0, 0, 1]],
                    color: 3
                },
                {
                    shape: [[1, 1, 0],
                        [0, 1, 1]],
                    color: 4
                },
                {
                    shape: [[1, 1, 1],
                        [0, 1, 0]],
                    color: 5
                },
                {
                    shape: [[1, 1, 1],
                        [1, 1, 1]],
                    color: 6
                },
                {
                    shape: [[1, 1],
                        [1, 1]],
                    color: 7
                },
            ];

    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const piece = {
            shape: randomPiece.shape,
            color: randomPiece.color,
            x: Math.floor(COLS / 2) - Math.floor(randomPiece.shape[0].length / 2),
            y: 0,
        };


    if (isCollision(piece)) {
   //Game Over
        clearInterval(gameInterval);
        alert("Game Over! Your score: " + score);
    }

    return piece;
}


function isCollision(piece) {
    return piece.shape.some(
        (row, i) => row.some(
            (value, j) => 
                value !== EMPTY 
                && (board[piece.y + i] && board[piece.y + i][piece.x + j])
                !== EMPTY)
    );
}

// A simple method to play sound effects
/* const soundPlayer = (sonido) => {
            let sound = new Audio(sonido);
            sound.play();
} */

function update() {
    currentPiece.y++;
    if
        (isCollision(currentPiece)) {
        currentPiece.y--;
        solidifyPiece();
        checkLines();
        currentPiece = generatePiece();
    }
}

function rotate() {
    const rotatedPiece = {
            shape: currentPiece.shape[0].map((_,i) => currentPiece.shape.map(row => row[i])).reverse(),
            color: currentPiece.color,
            x: currentPiece.x,
            y: currentPiece.y,
        };

    if (!isCollision(rotatedPiece)) {
        currentPiece.shape = rotatedPiece.shape;
    }
}

function move(direction) {
    currentPiece.x += direction;
    if (isCollision(currentPiece)) {
        currentPiece.x -= direction;
    }
}

function solidifyPiece() {
    currentPiece.shape.forEach((row, i) => {
        row.forEach((value, j) => {
            if (value !== EMPTY) {
                board[currentPiece.y + i][currentPiece.x + j] = currentPiece.color;
            }
        });
    });
    //soundPlayer(hit);
}

function checkLines() {
    let linesToRemove = [];
    for (let i = ROWS - 1; i >= 0; i--) {
        if (board[i].every(block => block !== EMPTY)) {
            linesToRemove.push(i);
            score += 100;
        }
    }

    linesToRemove.forEach(line => {
        board.splice(line, 1);
        board.unshift(Array(COLS).fill(EMPTY));
    });

    if (linesToRemove.length > 0) {
        updateScoreAndLevel();
        //soundPlayer(line);
    }
}

function updateScoreAndLevel() {
    if (score >= level * 500) {
        level++;
        speed -= 50;
        // decrease speed
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }
}

function gameLoop() {
    update();
    draw();
}

document.addEventListener("keydown" || "click", function (event) {
        if (event.key === "ArrowUp") {
            rotate();
        } else if (event.key === "ArrowRight") {
            move(1);
        } else if (event.key === "ArrowLeft") {
            move(-1);
        } else if (event.key === "ArrowDown") {
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, 50);
            // Increase speed temporarily
        }
    });

document.addEventListener("keyup",
    function (event) {
        if (event.key === "ArrowDown") {
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, speed);
            // Restore original speed
        }
    });

document.addEventListener("click", function (event) {
        rotate();
    });

document.addEventListener("touchstart", function (event) {
        const touchX = event.touches[0].clientX;
        const screenWidth = window.innerWidth;
        touchX < screenWidth / 2 ? move(-1) : move(1);
    });

gameInterval = setInterval(gameLoop, speed);