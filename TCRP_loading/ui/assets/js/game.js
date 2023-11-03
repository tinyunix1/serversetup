var canvas = document.getElementById("area"),
    ctx = canvas.getContext("2d");

canvas.width = 100;
canvas.height = 50;

var x = 0,
    y = 0,
    velY = 0,
    velX = 0,
    speed = 0.5,
    friction = 0.5,
    keys = [];

let spacing = 15;
let gameOver = false;
let menu = true;
let obstacles = [];
let score, displayScore = 0;
var tenSound;
var offSound;




var guiData = function() {
  this.characterSpeed = 0.9;
  this.difficulty = 3000;
  this.obstacleSpeed = 1;
  this.obstacleNb = 100;
};



var data;
(function init(){
  data = new guiData();
  var gui = new dat.GUI();
  gui.add(data, 'characterSpeed', 0.1, 1.5);
  gui.add(data, 'difficulty', 200, 4000);
  gui.add(data, 'obstacleSpeed', .5, 3);
  gui.add(data, 'obstacleNb', 1, 1000);
  gui.close();
  //gameStart()
  generateObstacle();
  mainMenu();
})();

function gameStart(){
  obstacles = []
  gameOver = false;
  x = 0;
  y = 25;
  score = 0;
  displayScore = 0;
  tenSound = new sound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/2201276/coin.wav");
  offSound  = new sound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/2201276/oof.mp3");
  generateObstacle();
  update();
}

function update() {
  if(!gameOver){
    requestAnimationFrame(update);
  }
  if (keys[38]) {
    if (velY > -data.characterSpeed) {
      velY--;
    }
  }

  if (keys[40]) {
    if (velY < data.characterSpeed) {
      velY++;
    }
  }
  if (keys[39]) {
    if (velX < data.characterSpeed) {
      velX++;
    }
  }
  if (keys[37]) {
    if (velX > -data.characterSpeed) {
      velX--;
    }
  }

  velY *= friction;
  y += velY;
  velX *= friction;
  x += velX;

  if (x >= 100) {
    x = 100;
  } else if (x <= 5) {
    x = 5;
  }

  if (y > 50) {
    y = 50;
  } else if (y <= 5) {
    y = 5;
  }

  ctx.clearRect(0, 0, 100, 50); 

  createObstacle(ctx);
  ctx.beginPath();
  ctx.fillStyle = "#2ecc71"; 
  ctx.arc(x, y, 3, 0, Math.PI * 2);  
  ctx.closePath();
  ctx.fill();

  if(obstacles[obstacles.length-1][0] < -50){
    gameOver = true;
  }

  if(gameOver){ 
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, 100, 50);

    ctx.fillStyle = "#2c3e50"; 
    ctx.font = '18px Roboto, sans-serif';
    ctx.fillText('Game Over!', 2, 17);
    ctx.font = '18px Roboto, sans-serif';
    ctx.fillText('Play Again?', 2, 34);
    ctx.font = '12px Roboto, sans-serif';
    ctx.fillText(`Score: ${displayScore}`, 5,48);    
    ctx.closePath();
    ctx.fill();
  }else{
    score++;  
    displayScore = Math.round(score * data.obstacleSpeed /(data.difficulty/100) ); 
    ctx.beginPath();
    ctx.fillStyle = "#2c3e50"; 
    ctx.font = '12px Roboto, sans-serif';

    ctx.fillText(displayScore, 100 - (8 * displayScore.toString().length) ,45);
    ctx.closePath();
    ctx.fill();
  }

}



document.body.addEventListener("keydown", function (e) {
  keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
  keys[e.keyCode] = false;
});

function createObstacle(ctx){
  obstacles.forEach((obs) =>{
    ctx.beginPath();  
    if(obs[2].toString().slice(-1) == "0"){
      ctx.fillStyle = "#f39c12";
    }else{
      ctx.fillStyle = "#e67e22";
    }
    ctx.rect(obs[0], 0, 8, obs[1]); 
    ctx.fill();
    ctx.rect(obs[0], obs[1] + spacing, 8, 50 - (obs[1] + spacing) ); 
    ctx.fill();
    obs[0] -= data.obstacleSpeed;

    collisionDetection(obs[0], obs[1],obs[2]);
  })
}

function generateObstacle(){
  let xPos = 140;
  let gap = 25;
  const space = 30;
  for(let i = 1; i <= data.obstacleNb ; i++){
    let amplitude = xPos/data.difficulty;    

    // Gap bewteen two bars
    const xPosMax = Math.round(50/amplitude)
    const xPosMin = Math.round(15/amplitude);
    let rng = Math.floor(Math.random() * (xPosMax - xPosMin)) + xPosMin;
    rng = rng > 150 ? Math.floor(Math.random() * (100 - 50)) + 50 : rng


    let max = Math.floor(Math.random() * ((gap + space) - gap)) + gap;
    let min = Math.floor(Math.random() * (gap  - (gap - space))) + (gap - space);

    min = min < 10 ? 10 : min;
    max = max > 40 ? 40 : max;
    let newGap =  Math.floor(Math.random() * (max - min)) + min;

    gap = (rng <= 20) ? Math.floor(Math.random() * ((gap+5) - (gap-5))) + gap-5 : newGap;




    obstacles.push([xPos , gap,i]);  
    xPos += +rng;
  }
}

function collisionDetection(xPos, gap,index){
  if(!menu){
    if(x > xPos && x < (xPos + 10) ){
      if(!(y > gap && y < (gap + spacing))){     
        gameOver=true;
        offSound.play();
      }else{
        if(index.toString().slice(-1) == "0"){
          tenSound.play();
        }
      }
    }
  }
}

canvas.addEventListener('click', function(evt) {  
  if(gameOver){
    gameStart();
  }

  if(menu){
    gameStart();
    menu = false;
  }
}, false);

function mainMenu(){
  //ctx.clearRect(0, 0, 150, 50);
  if(menu){
    requestAnimationFrame(mainMenu);
    createObstacle(ctx);

    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, 100, 50);

    ctx.fillStyle = "#2c3e50"; 
    ctx.font = '20px Roboto, sans-serif';
    ctx.fillText('Play ', 15, 25);

    ctx.fillStyle = "#2ecc71"; 
    ctx.font = '20px Roboto, sans-serif';
    ctx.fillText('▶', 55, 25);

    ctx.fillStyle = "#2c3e50"; 
    ctx.font = '11px Roboto, sans-serif';
    ctx.fillText('controls:', 5, 45);
    ctx.font = '10px Roboto, sans-serif';
    ctx.fillText('🢀 🢁 🢂 🢃', 50, 45);



    ctx.closePath();
    ctx.fill();
  }
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.volume = UM.Music.volume;
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

$( ".dg" ).remove();