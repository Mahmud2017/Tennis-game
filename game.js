var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 7;
var ballSpeedY = 4;
var ballRadius = 5;
var playerPaddleY = 250;
var computerPaddleY = 250;
var computerMovementSpeed = 6;
var playerScore = 0;
var computerScore = 0;
var gameOver = false;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 5;
const WINNING_SCORE = 3;
const GAP_FROM_BORDER = 10;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function() {
			moveAll();
			drawAll();	
		}, 1000/framesPerSecond);
		
	canvas.addEventListener("mousedown",mouseDownHandler);	
	
	canvas.addEventListener("mousemove",
		function(evt){
			var mousePos = calculateMousePosition(evt);
			playerPaddleY = mousePos.y - (PADDLE_HEIGHT / 2);
		}
	);
}

function mouseDownHandler(evnt){
	if(gameOver){
		playerScore = 0;
		computerScore = 0;
		gameOver = false;
	}
}

function calculateMousePosition(evnt){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement; //if the canvas is positioned in any other position of a webpage
	var mouseX = evnt.clientX - rect.left - root.scrollLeft;
	var mouseY = evnt.clientY - rect.top - root.scrollTop;
	
	return {
		x:mouseX,
		y:mouseY
	};
}

function resetTheBall(){
	if(playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE){
		gameOver = true;
	}

	ballSpeedX = -ballSpeedX;
	ballX = (canvas.width / 2) - (ballRadius / 2);
	ballY = (canvas.height / 2) - (ballRadius / 2);
}

function computerMovement(){
	var computerPaddleCenter = computerPaddleY + (PADDLE_HEIGHT / 2);
	if(computerPaddleCenter < (ballY - (PADDLE_HEIGHT * 0.09))){
		computerPaddleY += computerMovementSpeed;
	}
	else if(computerPaddleCenter > (ballY + (PADDLE_HEIGHT * 0.09))){
		computerPaddleY -= computerMovementSpeed;
	}
}

function moveAll() {
	if(gameOver)
		return;

	computerMovement();

	ballX += ballSpeedX;
	ballY += ballSpeedY;
	
	if(ballX >= canvas.width - ballRadius - PADDLE_WIDTH - GAP_FROM_BORDER){
		if(ballY > computerPaddleY && ballY < (computerPaddleY + PADDLE_HEIGHT)){
			ballSpeedX = -ballSpeedX;
			
			var deltaY = ballY - (computerPaddleY + (PADDLE_HEIGHT / 2));
			ballSpeedY = deltaY * 0.35;
		}
		else{
			playerScore++;
			resetTheBall();
		}
	}
	else if(ballX <= PADDLE_WIDTH + GAP_FROM_BORDER){
		if(ballY > playerPaddleY && ballY < (playerPaddleY + PADDLE_HEIGHT)){
			ballSpeedX = -ballSpeedX;
			
			var deltaY = ballY - (playerPaddleY + (PADDLE_HEIGHT / 2));
			ballSpeedY = deltaY * 0.35;
		}
		else{
			computerScore++;
			resetTheBall();
		}
	}
		
	if(ballY >= canvas.height - ballRadius)
		ballSpeedY = -ballSpeedY;
	else if(ballY <= 0)
		ballSpeedY = -ballSpeedY;
}

function drawTheNet(){
	for(var i = 10; i < canvas.height; i += 40){
		createFilledRect((canvas.width / 2) - 1, i, 2, 20, "white");
	}
}

function drawAll() {
	//draw board
	createFilledRect(0,0,canvas.width,canvas.height,"black");
	
	//game over check and winner display if game is over
	if(gameOver){
		canvasContext.font="60px Georgia";
		canvasContext.fillStyle = "white";
		if(playerScore >= WINNING_SCORE){
			canvasContext.fillText("YOU WIN!!", canvas.width * 0.32, canvas.height * 0.40);
		} else if(computerScore >= WINNING_SCORE){
			canvasContext.fillText("Computer WIN!!", canvas.width * 0.20, canvas.height * 0.40);
		}
		canvasContext.font="40px Georgia";
		canvasContext.fillText("Click to continue...", canvas.width * 0.30, canvas.height * 0.80);
		return;
	}
	
	//draw the net
	drawTheNet();
	
	//draw player paddle
	createFilledRect(GAP_FROM_BORDER,playerPaddleY,PADDLE_WIDTH,PADDLE_HEIGHT,"white");
	
	//draw computer paddle
	createFilledRect(canvas.width - PADDLE_WIDTH - GAP_FROM_BORDER,computerPaddleY,PADDLE_WIDTH,PADDLE_HEIGHT,"white");
	
	//draw ball
	createFilledCircle(ballX,ballY,ballRadius,"white");
	
	//scores display
	canvasContext.font="20px Georgia";
	canvasContext.fillText(playerScore, 100, 20);
	canvasContext.fillText(computerScore, canvas.width - 100, 20);
}

function createFilledRect(X,Y,Width,Height,fillColor){
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(X,Y,Width,Height);
}

function createFilledCircle(X,Y,Radius,fillColor){
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(X, Y, Radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}