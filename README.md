# Flappy-Bird

A Flappy Bird clone I made using vanilla JavaScript. Start the game by either clicking the mouse or by pressing the spacebar. On mobile you start the game by tapping anywhere on the screen. Avoid hitting the ground or the pipes by jumping. To jump you can either click the mouse, press the spacebar, or tap the screen if you are on mobile. You earn one point for every set of pipes you pass through.

The images for the bird come from https://bevouliin.com/
The sky background image comes from https://opengameart.org/content/sky-backdrop

<img src="https://github.com/MichaelMcCann1/Flappy-Bird/blob/main/FlappyBird.png" height="300px">


## Code Explanation

### Starting the Game
The entire game is sctructured in a JavaScript class. The class definition is called `Game` and it is saved to a variable called `game`. An instance of the game is created when the user clicks the screen or pushes the space bar. Event listeners wait for both of these actions. Once an instance of the game is created then the event listeners will not create another instance of the game. 

``` javascript
let game;
  window.addEventListener('click', () => {
    if (!game) game = new Game(gravity, initialBirdPosition)
    game.jump()
  })
  window.addEventListener('keyup', (e) => {
    if (!game && e.key === ' ') game = new Game(gravity, initialBirdPosition)
    if (e.key === ' ') game.jump()
  })
```

The `Game` class takes in two arguments. The first is `gravity` which controlls how quickly the bird is pulled down. The second is `initialBirdPosition` which is the initial location of the bird on the screen. The location changes based on the size of the screen. 

The game operates by running several methods of the `game` object repeatedly by using the `setInterval` method. An in depth description of most of these methods will be given later. For instance, when the game starts the bird needs to be pulled down to the ground. This is accomplised by running the `game.pullBird()` methed every 20 ms. The constructor the of `Game` class is shown below and shows the `setInterval`'s that run the game.

```  javascript
constructor(gravity, birdTop) {
  this.gravity = gravity;
  this.birdTop = birdTop;
  this.scoreElement = scoreElementSelector;
  this.birdSpeed = 0;
  this.hiscore = 0;
  this.pull = setInterval(() => {game.pullBird()}, 20);
  this.generateObstacles = setInterval(() => {game.generateObstacle()}, 2000);
  this.moveObstacles = setInterval(() => {game.moveObstacle()}, 20);
 }
```

### Simulating Gravity

The bird is pulled down to the ground with the `pullBird()` method. This method is run every 20 ms as shown in the constructor above. The function works by first taking the birds current speed and adding the `gravity` variable to it. Then the new speed and adding it to the current position of the bird. The `top` style of the bird is then set to the resulting number. This results not only in the bird moving downward but also the bird actually accelerates downward like in real life. 

The `pullBird` method also checks if the the bird has hit the ground by comparing the `BoundingClientRect()` of the bird and the ground. If the bottom of the bird goes past the top of the ground then it ends the game.

``` javascript
pullBird() {
  this.birdSpeed += this.gravity
  this.updatePosition(this.birdSpeed)
  if (birdSelector.getBoundingClientRect().bottom > groundSelector.getBoundingClientRect().top) { //check if bird hits the ground
    game.gameOverScreenPopup()
  }
}
  
updatePosition(speed){
  this.birdTop += speed;
  birdSelector.style.top = this.birdTop + 'px';
}
```

### Jumping
An event listener listens for a mouse click or a spcae bar press to run `game.jump()`. A jump is accomplised by setting the speed of the bird to a negative value. This moves the bird upward. The `pullBird()` method will continue to accelerate the bird downward so the bird will move upward, hit its apex, and then move downward. 

An animation of the bird flapping its wings also takes place. When `game.jump` is called then the src of the image is changed to an image of the bird with its wings pointing downward. A `setTimeout` method is called to change the image of the wings back up after 100ms. 

``` javascript
jump(){
  this.birdSpeed = -6 //pulls bird up
  if (birdImgSelector.src.includes('wing-up.png')) {
    setTimeout(() => birdImgSelector.src = wingUpPath, 100 )
  }
  birdImgSelector.src = wingDownPath
}
```

### Obstacle Generation and Movement
A set of obstaacles are generated every 2000ms and all obstacles are moved every 20ms as defined in the class constructor.

All obstacles are stored in an obstacle container which is shown in HTML markup. This `div` is placed to the right of the game and the bottom of the `div` is at the same height as the top of ground container. A bottom obstacle is created by randomly generating a height. This obstacle is then appeneded to the obstacle container `div`. The height of the top obstacle is calculated by taking the height of the entire game and substracting the height of the ground, the height of the bottom obstacle, and 150px. The result is an obstacle that will leave a gap of 150px between the bottom and top obstacle.

The obstacles are moved by taking their `left` style and subtracting the value by 3px. After every movement the game checks for a collision between the bird and the obstacles. This is accomplised by using the `getBoundingClientRect` of the obstacle and the bird. The score is updated in a similar way. The game checks if the bird made it through the gap of the pipes by again using the location of the obstacles and bird by using `getBoundingClientRect`.

### Ending the game
The game ends when the bird collides with either the ground or an obstacle. Once this takes palce the `game.gameOverScreenPopup()` method is called. This function first clears all the intervals set earlier (pullBird(), generateObstacle(), and moveObstacle()). It then changes the display of a modal and the popup screen which tells the player what the highscore is and how to play again.

``` javascript
gameOverScreenPopup(){
  clearInterval(this.pull)
  clearInterval(this.generateObstacles)
  clearInterval(this.moveObstacles)
  gameOverScreenSelector.style.display = 'flex'
  .
  .
  .
  window.addEventListener('keyup', this.clearGame)
  window.addEventListener('click', this.clearGame)
```

### Resetting the Game
The game is reset once the player loses and then either clicks or pushes the spcae bar. Doing so runs `game.clearGame()`. This method first removes the modal and popup message. It then removes all the obstacles from the obstacle container. This is accmplised by using a while loop. The loop will remove the last child of the obstacle container until there are no more children.

Then the method will set the position of the bird add it will set all the intervals back to the game to make the game start again. 

``` javascript
clearGame(event){
  if (event.key === ' ' || event.type === "click") {
    gameOverScreenSelector.style.display = 'none';
    gameOverScoreSelector.textContent = 'Score: ';  
    scoreElementSelector.textContent = 0;
    while (obstacleContainer.firstChild) {
      obstacleContainer.removeChild(obstacleContainer.lastChild);
    }
    game.resetTimers();
  }
}
  
resetTimers(){
  this.birdSpeed = 0;
  this.birdTop = initialBirdPosition;
  this.pull = setInterval(() => {game.pullBird()}, 20);
  this.generateObstacles = setInterval(() => {game.generateObstacle()}, 2000);
  this.moveObstacles = setInterval(() => {game.moveObstacle()}, 20);
  game.jump()
}
```
