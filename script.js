let width;
let height;
let gridUnitSize;
let canvas;
let canvasContext;
let food;
let snake;
let fps = 10;
// let borderOffset = 10;


//start game using load event 
window.onload = () => {
  startGame();
}

//Start Game
function startGame() {
  init();
  setInterval(update, (1000 / fps));
  // update();
}

//Initialize of game
function init() {
  gridUnitSize = 20;
  canvas = document.getElementById("game-container");
  width = gridUnitSize * Math.floor( (window.innerWidth - 20) / gridUnitSize);
  height = gridUnitSize * Math.floor( (window.innerHeight - 20) / gridUnitSize);
  canvas.width = width;
  canvas.height = height;
  canvasContext = canvas.getContext("2d");
  canvasContext.font = "30px Arial";
  canvasContext.textAlign = "center";
  canvasContext.strokeStyle = "#72b3a0";
  canvasContext.strokeText("Snake Game", width / 2, 50);

  food = new SnakeFood(foodLocation(), 'red');
  let initialHeadPositions = {x: (gridUnitSize * Math.floor(width / (2 * gridUnitSize))), 
                              y: (gridUnitSize * Math.floor(height / (2 * gridUnitSize)))} 
  snake = new Snake(initialHeadPositions, "#39ff14");

}

//update the game
function update() {
    // food = new SnakeFood(foodLocation(), 'red');
    snake.boundary();
    if(snake.eat()) {
      food = new SnakeFood(foodLocation(), 'red');
    } 
    canvasContext.clearRect(0, 0, width, height); 
    food.draw();
    snake.draw();
    snake.move();
}

//Get food for snake
class SnakeFood {
    constructor(pos, color) {
        this.x = pos.x;
        this.y = pos.y;
        this.color = color;
    }
    draw() {
      drawRect(this.x, this.y, this.color);
    }
};

// Get food location
function foodLocation() {
  let xPos, yPos;
  let xGrideCount = width / gridUnitSize;
  let yGrideCount = height / gridUnitSize;
  xPos = Math.floor((Math.random() * xGrideCount) * gridUnitSize);
  yPos = Math.floor((Math.random() * yGrideCount) * gridUnitSize);
  xPos = xPos > width - gridUnitSize ? xPos - gridUnitSize : xPos;
  xPos = yPos > height - gridUnitSize ? yPos - gridUnitSize : xPos;
  return {x: xPos, y: yPos};
}

class Snake {
  constructor(pos, color) {
    this.x = pos.x;
    this.y = pos.y;
    this.color = color;
    this.tail = [{x: pos.x - gridUnitSize, y: pos.y}, {x: pos.x - (2 * gridUnitSize), y: pos.y}];
    this.dirX = 1;
    this.dirY = 0;
  }

  // To draw snake
  draw() {
    drawRect(this.x, this.y, this.color);
    for(let i = 0; i < this.tail.length; i++) {
      drawRect(this.tail[i].x, this.tail[i].y, this.color);
    }
  }

  // To Move snake
  move() {
    for(let i = this.tail.length - 1; i > 0; i--) {
      this.tail[i] = this.tail[i - 1];
    }
    this.tail[0] = {x: this.x, y: this.y};
    this.x = this.x + gridUnitSize * this.dirX;
    this.y = this.y + gridUnitSize * this.dirY;
  }

  direction(x, y) {
    this.dirX = x;
    this.dirY = y; 
  }

  eat() {
    if(Math.abs(this.x - food.x) < gridUnitSize && Math.abs(this.y - food.y) < gridUnitSize) {
      this.tail.push({});
      return true;
    }
    return false;
  }

  boundary() {
    if(this.x + gridUnitSize > width && this.dirX != -1 || this.x < 0 && this.dirX != 1) {
      this.x = width - this.x;
    } else if(this.y + gridUnitSize > height && this.dirY != -1 || this.y < 0 && this.dirY != 1) {
      this.y = height - this.y;
    }
  }
}

function drawRect(x, y, color) {
  canvasContext.beginPath();
  canvasContext.rect(x, y, gridUnitSize, gridUnitSize);
  canvasContext.fillStyle = color;
  canvasContext.fill();
  canvasContext.strokeStyle = 'black';
  canvasContext.lineWidth = 3;
  canvasContext.stroke();
  canvasContext.closePath(); 
}




document.addEventListener('keydown', (args) => {
  let checkPosition = (snake.x > 0) && (snake.x < width) && (snake.y > 0) && (snake.y < height - 0);
  if(args.key === 'ArrowUp' && snake.dirY !== 1 && checkPosition) {
    snake.direction(0, -1)
  } else if(args.key === 'ArrowDown' && snake.dirY !== -1 && checkPosition) {
    snake.direction(0, 1);
  } else if(args.key === 'ArrowRight' && snake.dirX !== -1 && checkPosition) {
    snake.direction(1, 0);
  } else if(args.key === 'ArrowLeft' && snake.dirX !== 1 && checkPosition) {
    snake.direction(-1, 0);
  }
})