//create and initialize variables
var canvas = document.getElementById("canvas");
var image = 'sship.png';
var contxt = canvas.getContext("2d");

var lefty = false;
var righty = false;
var gameOver = false;
var startScreen = true;
var score = 0;
var lives = 3;
var track = 0;
var badTrack = 0;
var level = 1;


document.addEventListener("keydown", keysDown, false);
document.addEventListener("keyup", keysUp, false);

// when key is pressed
function keysDown(e) {
	if(e.keyCode == 39){
		righty = true;
	}
	else if(e.keyCode == 37){
		lefty = true;
	}
	else if(e.keyCode == 32 && gameOver){
		playAgain();
	}
  else if(e.keyCode == 32 && startScreen){
    startScreen = false;
		playAgain();
	}
}
// when key is released
function keysUp(e) {
	if(e.keyCode == 39){
		righty = false;
	}
	else if(e.keyCode == 37){
		lefty = false;
	}
	
}

// player object
var player = {
	size: 40,
	x: (canvas.width -40)/ 2,
	y: canvas.height - 40,
	color: "green"
};

// benefit objects
var goodArc = {
	x:[],
	y:[],
	speed: 2,
	color: ["red","blue","yellow"],
	state: []
};
var redNum = 0;

// harm objects
var badArc = {
	x:[],
	y:[],
	speed: 2,
	color: ["purple", "white", "green"]

};
var blackNum = 0;
var rad = 10;

// adds value to x property of goodArc
function drawNewGood(){
	if(Math.random() < .02){
		goodArc.x.push(Math.random() * canvas.width);
		goodArc.y.push(0);
		goodArc.state.push(true);

	}
	redNum = goodArc.x.length;
}

//adds values to x property of badArc
function drawNewBad() {
	if(score < 300){
		if(Math.random() < .05){
			badArc.x.push(Math.random() * canvas.width);
			badArc.y.push(0);
		}
	}
	else if(score < 500){
		if(Math.random() < .1){
			badArc.x.push(Math.random() * canvas.width);
			badArc.y.push(0);
		}
	}
	else{
		if(Math.random() < .2){
			badArc.x.push(Math.random() * canvas.width);
			badArc.y.push(0);
		}
	}
	blackNum = badArc.x.length;
}

// draws objects to collect
function drawRedBall() {
	for(var i = 0; i < redNum; i++){
		if(goodArc.state[i] == true){
			//Keeps track of position in color array with changing redNum size
			var trackCol = (i + track);
		
			contxt.beginPath();
			contxt.arc(goodArc.x[i], goodArc.y[i], rad, 0, Math.PI * 2);
			contxt.fillStyle = goodArc.color[trackCol % 3];
			contxt.fill();
			contxt.closePath();
		}
	}
}

// draws objects to avoid
function drawBlackBall() {
	for(var i = 0; i < blackNum; i++){
		//Keeps track of position in color array with changing blackNum size
		var badCol = (i + badTrack);
		
		contxt.beginPath();
		contxt.arc(badArc.x[i], badArc.y[i], rad, 0, Math.PI * 2);
		contxt.fillStyle = badArc.color[badCol % 3];
		contxt.fill();
		contxt.closePath();
	}
}
// draw player to canvas
function drawPlayer() {
  base_image = new Image();
  base_image.src = image;
  contxt.drawImage(base_image, player.x, player.y, player.size, player.size);
}

// moves objects in play
function playUpdate() {
	
	if(lefty && player.x > 0){
		player.x -= 7;
	}
	if(righty && player.x + player.size < canvas.width) {
		player.x += 7;
	}
	for(var i = 0; i < redNum; i++){
		goodArc.y[i] += goodArc.speed;
	}
	for(var i = 0; i < blackNum; i++){
		badArc.y[i] += badArc.speed;
	}
	
	// collision detection
	for(var i = 0; i < redNum; i++){
		// Only counts collision once
		if(goodArc.state[i]){
			if(player.x < goodArc.x[i] + rad && player.x + 30 + rad> goodArc.x[i] && player.y < goodArc.y[i] + rad && player.y + 30 > goodArc.y[i]){
				score+=10;
				// Cycles through goodArc's color array
				//player.color = goodArc.color[(i + track) % 3];
				goodArc.state[i] = false;
			}
		}
		// Removes circles from array that are no longer in play
		if(goodArc.y[i] + rad > canvas.height){
			goodArc.x.shift();
			goodArc.y.shift();
			goodArc.state.shift();
			track++;
		}
	}
	for(var i = 0; i < blackNum; i++){
		if(player.x < badArc.x[i] + rad && player.x + 30 + rad > badArc.x[i] && player.y < badArc.y[i] + rad && player.y + 30 > badArc.y[i]){
			lives--;
			//player.color = badArc.color[(i+badTrack)%5];
			badArc.y[i] = 0;
			if(lives <= 0){
				gamesOver();
			}
		}
		// Removes circles from x and y arrays that are no longer in play
		if(badArc.y[i] + rad > canvas.height){
			badArc.x.shift();
			badArc.y.shift();
			badTrack++;
		}
	}
	switch(score){
		case 100:
			badArc.speed = 3;
			goodArc.speed = 3;
			level = 2;
			break;
		case 200:
      badArc.speed = 4;
			goodArc.speed = 4;
			level = 3;
			break;
		case 300: 
			badArc.speed = 5;
			goodArc.speed = 5;
			level = 4;
			break;
		case 400:
      badArc.speed = 6;
			goodArc.speed = 6;
			level = 5;
			break;
	}

}
//signals end of game and resets x, y, and state arrays for arcs
function gamesOver(){
	goodArc.x = [];
	badArc.x = [];
	goodArc.y = [];
	badArc.y = [];
	goodArc.state = [];
	gameOver = true;
}

//resets game, life, and score counters
function playAgain() {
	gameOver = false;
	player.color = "green";
	level = 1;
	score = 0;
	lives = 3;
	badArc.speed = 2;
	goodArc.speed = 2;
}

function draw(){
	contxt.clearRect(0, 0, canvas.width, canvas.height);
  if(startScreen){
    contxt.fillStyle = "white";
		contxt.font = "25px Helvetica";
		contxt.textAlign = "center";
		contxt.fillText("Welcome to The Galaxy Collection Game!", canvas.width/2, 175);
		
		contxt.font = "20px Helvetica";
		contxt.fillText("PRESS SPACE TO PLAY", canvas.width/2, 475);
  }
	else if(!gameOver){
    
		drawPlayer();
		drawBlackBall();
		drawRedBall();
		playUpdate();
		drawNewGood();
		drawNewBad();
			
		//score
		contxt.fillStyle = "white";
		contxt.font = "20px Helvetica";
		contxt.textAlign = "left";
		contxt.fillText("Score: " + score, 10, 25);
	
		//lives
		contxt.textAlign = "right";
		contxt.fillText("Lives: " + lives, 500, 25);
	}
	else{
		contxt.fillStyle = "white";
		contxt.font = "25px Helvetica";
		contxt.textAlign = "center";
		contxt.fillText("GAME OVER!", canvas.width/2, 175);
		
		contxt.font = "20px Helvetica";
		contxt.fillText("PRESS SPACE TO PLAY", canvas.width/2, 475);
		
		contxt.fillText("FINAL SCORE: " + score, canvas.width/2, 230);
	}
	document.getElementById("level").innerHTML = "Level: " + level;
	requestAnimationFrame(draw);
}



draw();