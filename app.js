// DOM Selectors
const bird = document.querySelector('.bird');
const ground = document.querySelector('.ground');
const birdImg = document.querySelector('#birdImg')
const gameContainer = document.querySelector('.game');
const body = document.querySelector('body');
const obstacleContainer = document.querySelector('.obstacleContainer');
const obstacleContainer2 = document.querySelector('.obstacleContainer2')
const scoreElement = document.querySelector('.score');
const gameOverScreen = document.querySelector('.gameOver');
const gameOverScore = document.querySelector('.gameOverScore');
const hiscoreSelector = document.querySelector('.hiscore')
const wingUpPath = "Images/Yellow/wing-up.png";
const wingDownPath = "Images/Yellow/wing-down.png"

const birdTop = 200; //initial position of bird
const gravity = .3 ; //constant value of how quickly gravity pulls you down
const gravitySpeed = 0; //actual speed that changes
obstacleContainer.style.bottom = 299 + parseFloat(getComputedStyle(ground).height.slice(0,-2)) + 'px'; //set position of obstacle container


class Game {
  constructor(gravity, gravitySpeed, birdTop, scoreElement) {
    this.gravity = gravity;
    this.gravitySpeed = gravitySpeed; 
    this.birdTop = birdTop;
    this.scoreElement = scoreElement;
    this.pull = setInterval(() => {game.pullBird()}, 20);
    this.generateObstacles = setInterval(() => {game.generateObstacle()}, 2000);
    this.moveObstacles = setInterval(() => {game.moveObstacle()}, 20);
    this.hiscore = 0;
  }
   
  pullBird() {
    this.gravitySpeed += this.gravity;
    this.updatePosition(this.gravitySpeed);
    if (bird.getBoundingClientRect().bottom > ground.getBoundingClientRect().top) { //check if bird hits the ground
      game.gameOverScreenPopup();
    }
  }

  updatePosition(speed){
    this.birdTop += speed;
    bird.style.top = this.birdTop + 'px';
  }

  jump(){
    this.gravitySpeed = -6;
    if (/wing-up.png/.test(birdImg.src)) {
      setTimeout(() => birdImg.src = wingUpPath, 100 );
    }
    birdImg.src = wingDownPath;
  }

  generateObstacle(){
    let obsHeight = Math.random() * (300 - 100) + 100;
    let obstacle = document.createElement('div');
    obstacleContainer.appendChild(obstacle)
    obstacle.classList.add('obstacle');
    obstacle.style.height = obsHeight + 'px';

    obstacle = document.createElement('div');
    obstacleContainer2.appendChild(obstacle)
    obstacle.classList.add('obstacle', 'obstacle2');
    obsHeight = 375 - obsHeight;
    obstacle.style.height = obsHeight + 'px';
  }

  moveObstacle(){
    let obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(item => {
      let obsLeft = parseFloat(getComputedStyle(item).left.slice(0,-2));
      obsLeft -= 3;
      item.style.left = obsLeft + 'px'
      
      game.checkCollision(item);
      
      let dist = item.getBoundingClientRect().left - bird.getBoundingClientRect().left;
      if (dist <= 3 && dist > 0 && !item.classList.contains('obstacle2')){
        this.updateScore();
      }
    })
  }

  checkCollision(item){
    if (!item.classList.contains('obstacle2')){
      if (item.getBoundingClientRect().left < bird.getBoundingClientRect().right && bird.getBoundingClientRect().bottom > item.getBoundingClientRect().top && bird.getBoundingClientRect().left < item.getBoundingClientRect().right) { //check for collision with obstacle
        game.gameOverScreenPopup();
      }
    }
    if (item.classList.contains('obstacle2')){
      if (item.getBoundingClientRect().left < bird.getBoundingClientRect().right && bird.getBoundingClientRect().top < item.getBoundingClientRect().bottom && bird.getBoundingClientRect().left < item.getBoundingClientRect().right) {
        game.gameOverScreenPopup();
      }
    }
  }

  updateScore(){
    this.scoreElement.textContent = parseInt(this.scoreElement.textContent) + 1;
  }

  gameOverScreenPopup(){
    clearInterval(this.pull);
    clearInterval(this.generateObstacles);
    clearInterval(this.moveObstacles);
    gameOverScreen.style.display = 'flex';
    gameOverScore.textContent += this.scoreElement.textContent.toString();
    if (this.scoreElement.textContent > this.hiscore) {
      this.hiscore = parseInt(this.scoreElement.textContent);
      hiscoreSelector.textContent = `Best Score: ${this.hiscore}`;
    }
    window.addEventListener('keydown', this.clearGame);
  }

  clearGame(event){
    if (event.key === ' ') {
      gameOverScreen.style.display = 'none';
      gameOverScore.textContent = 'Score: ';  
      scoreElement.textContent = 0;
      while (obstacleContainer.firstChild) {
        obstacleContainer.removeChild(obstacleContainer.lastChild);
      }
      while (obstacleContainer2.firstChild) {
        obstacleContainer2.removeChild(obstacleContainer2.lastChild);
      }
      game.resetTimers();
      game.removeClearGameListener();
    }
  }

  resetTimers(){
    this.gravitySpeed = 0;
    this.birdTop = 200;
    this.pull = setInterval(() => {game.pullBird()}, 20);
    this.generateObstacles = setInterval(() => {game.generateObstacle()}, 2000);
    this.moveObstacles = setInterval(() => {game.moveObstacle()}, 20);
  }

  removeClearGameListener(){
    window.removeEventListener('keydown', this.clearGame)
  }
}


let game = new Game(gravity, gravitySpeed, birdTop, scoreElement); 

window.addEventListener('keyup', event => { 
    if (event.key === ' ') {
    game.jump();
  }
})