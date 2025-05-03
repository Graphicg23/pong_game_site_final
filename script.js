
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 100;
let player = { x: 0, y: canvas.height/2 - paddleHeight/2, width: paddleWidth, height: paddleHeight, color: "white", score: 0 };
let ai = { x: canvas.width - paddleWidth, y: canvas.height/2 - paddleHeight/2, width: paddleWidth, height: paddleHeight, color: "white", score: 0 };
let ball = {
  x: canvas.width / 2, y: canvas.height / 2, radius: 10,
  speed: 5, velocityX: 5, velocityY: 5, color: "white"
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y) {
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText(text, x, y);
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX *= -1;
  ball.speed = 5;
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, "#000");
  drawText(player.score, canvas.width / 4, 50);
  drawText(ai.score, 3 * canvas.width / 4, 50);
  drawRect(player.x, player.y, player.width, player.height, player.color);
  drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function collision(b, p) {
  return b.x - b.radius < p.x + p.width &&
         b.x + b.radius > p.x &&
         b.y - b.radius < p.y + p.height &&
         b.y + b.radius > p.y;
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
    ball.velocityY = -ball.velocityY;

  let playerOrAI = (ball.x < canvas.width / 2) ? player : ai;
  if (collision(ball, playerOrAI)) {
    let collidePoint = ball.y - (playerOrAI.y + playerOrAI.height / 2);
    collidePoint = collidePoint / (playerOrAI.height / 2);
    let angle = (Math.PI / 4) * collidePoint;
    let direction = (ball.x < canvas.width / 2) ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);
    ball.speed += 0.5;
    new Audio('bounce.mp3').play();
  }

  if (ball.x - ball.radius < 0) { ai.score++; resetBall(); }
  else if (ball.x + ball.radius > canvas.width) { player.score++; resetBall(); }

  if (isTouch) ai.y = ball.y - ai.height / 2;
  else {
    if (ball.y < ai.y + ai.height / 2) ai.y -= 5;
    else if (ball.y > ai.y + ai.height / 2) ai.y += 5;
  }
}

function game() {
  update();
  draw();
}

let isTouch = false;
canvas.addEventListener("touchstart", () => isTouch = true);
canvas.addEventListener("touchmove", (e) => {
  let rect = canvas.getBoundingClientRect();
  player.y = e.touches[0].clientY - rect.top - player.height / 2;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "w") player.y -= 20;
  if (e.key === "s") player.y += 20;
  if (e.key === "ArrowUp") ai.y -= 20;
  if (e.key === "ArrowDown") ai.y += 20;
});

setInterval(game, 1000 / 60);
