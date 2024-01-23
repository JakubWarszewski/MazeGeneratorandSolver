'use strict';

/**
 * ICS4UC Final Project
 * 
 * Author: Jakub Warszewski 
 * Description: Maze Solver (and Generator?)
 * 
 */

//Global variables

//Maze array
let maze = [];

//Array of previously visited locations
let prevLocs = [];

//Directions that are outputted
let directions = [];

//Dimensions
let vert = 0;
let hor = 0;

//For generation, if solution is created
let solved = false;

//For toggling solution dispaly
let solutionPrinted = false;

//HTML get elements
let input = $("maze_input");
let vSize = $("v_size");
let hSize = $("h_size");

let canvas = $("canvas");
let context = canvas.getContext("2d");

let invalidDisp = $("invalid");

//Event listeners
$("enter").addEventListener("click", getInput);
$("solve").addEventListener("click", solveMaze);
$("generate_maze").addEventListener("click", generateMaze);


//Helper functions: 

function $(id) {
  return document.getElementById(id);
}

//Random number generator
function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//Converts user string input to maze of empty spaces (0) and walls (1)
function inputToMaze(input, vert, hor) {
  let newMaze = [];
  for (let i = 0; i < vert; i++) {
    let tempArr = [];
    for (let j = 0; j < hor; j++) {
      if (input[i * hor + j] == "1") {
        tempArr.push(1);
      } else if (input[i * hor + j] == "0"){
        tempArr.push(0);
      } else {
        invalidDisp.hidden = false; 
        return generateEmpty();
      }
    }
    newMaze.push(tempArr);
  }
  return newMaze;
}

//Retrieves input values from HTML, and prints unsolved maze
function getInput() {
  //Limits maze to a minumum of 3x3, and ensures the dimensions correspond to the input
  if ((Math.ceil(vSize.value) >= 3) && (Math.ceil(hSize.value) >= 3) && ((Math.ceil(vSize.value))*(Math.ceil(hSize.value)) == input.value.length)) {
    invalidDisp.hidden = true;
    vert = Math.ceil(vSize.value);
    hor = Math.ceil(hSize.value);
    maze = inputToMaze(input.value, vert, hor);
    canvas.height = 16 * vert;
    canvas.width = 16 * hor;
    printEmptyMaze();
  } else {
    invalidDisp.hidden = false;
  }
}

//Maze solving function
function solveMaze() {

  //Toggle mechanism for printed solution
  if (solutionPrinted == true) {
    printEmptyMaze();
    solutionPrinted = false;
    return;
  }

  //Finds hole at the top of the maze to start from
  let startingX = -1;
  for (let i = 1; i < hor - 1; i++) {
    if (maze[0][i] == 0) {
      startingX = i;
    }
  }
  if (startingX == -1) {
    invalidDisp.hidden = false;
  }

  directions = [];

  //Empty array of true/false values that tracks visited cells
  prevLocs = [];
  for (let i = 0; i < vert; i++) {
    let temp = []
    for (let j = 0; j < hor; j++) {
      temp.push(false);
    }
    prevLocs.push(temp);
  }

  //Runs recursive helper function
  if (solverHelper(startingX, 0)) {
    printSolution();
  } else {
    invalidDisp.hidden = false;
  }
}

//Recursive helper function for solving
function solverHelper(x, y) {

  //Base case: if cell is occupied/has been visited, return false
  if (prevLocs[y][x] || maze[y][x] == 1) {
    return false;
  }

  //Base case: if bottom edge found, then return true
  if (y == vert - 1) {
    directions.push([x, y]);
    return true;
  }

  //Logs movement
  prevLocs[y][x] = true;

  //Movements:
  //Down
  if (y < vert - 1) {
    if (solverHelper(x, y + 1) == true) {
      directions.push([x, y]);
      return true;
    }
  }

  //Up
  if (y > 0) {
    if (solverHelper(x, y - 1) == true) {
      directions.push([x, y]);
      return true;
    }
  }

  //Right
  if (x < hor - 1) {
    if (solverHelper(x + 1, y) == true) {
      directions.push([x, y]);
      return true;
    }
  }

  //Left
  if (x > 0) {
    if (solverHelper(x - 1, y) == true) {
      directions.push([x, y]);
      return true;
    }
  }

  return false;
}

//Blank array generator (all walls)
function generateEmpty() {
  let newMaze = [];
  for (let i = 0; i < vert; i++) {
    let tempArr = [];
    for (let j = 0; j < hor; j++) {
      tempArr.push(1);
    }
    newMaze.push(tempArr);
  }
  return newMaze;
}

//Maze generator function
function generateMaze() {

  //Resets the toggle state of the shown solution
  solutionPrinted = false;

  //Gets required input values
  if ((Math.ceil(vSize.value) >= 3) && (Math.ceil(hSize.value) >= 3)) {
    invalidDisp.hidden = true;
    vert = Math.ceil(vSize.value);
    hor = Math.ceil(hSize.value);
    maze = generateEmpty();
    canvas.height = 16 * vert;
    canvas.width = 16 * hor;
    solved = false;
  } else {
    invalidDisp.hidden = false;
  }


  //Random starting location at top
  let startingX = randInt(1, hor - 2);
  maze[0][startingX] = 0;

  //Runs helper function
  generatorHelper(startingX, 1);

  //Vertically flips the maze, as it is much more complex if solved backwards
  maze.reverse();
  printEmptyMaze();
}

//Helper function for generation
function generatorHelper(x, y) {
  //Base case - path to bottom is generated
  if (y == vert - 2 && solved == false) {
    solved = true;
    maze[y + 1][x] = 0;
  }

  //Generates square
  maze[y][x] = 0;

  //Gets randomized directions
  let moves = randomizeDirs();

  //Checks and moves to all possible directions
  for (let i = 0; i < 4; i++) {
    generateDirections(moves[i], x, y)
  }

  return;
}

//Creates a randomized array of the numbers 1-4
//I made a better one, but I liked the pattern this one creates more
function randomizeDirs() {
  let moves = [];
  if (randInt(0, 1) == 0) {
    moves = [1, 2, 3, 4];
  } else {
    moves = [3, 1, 4, 2];
  }
  let output = [];
  for (let i = 0; i < 4; i++) {
    if (randInt(0, 1) == 0) {
      output.push(moves.pop());
    } else {
      output.push(moves.shift());
    }
  }
  return output;
}

//Helper function to check directions
function generateDirections(direction, x, y) {
  if (direction == 1) {
    //Up
    if (y > 1 && checkMove(x, y - 1, "up")) {
      generatorHelper(x, y - 1);
    }
  } else if (direction == 2) {
    //Right
    if (x < hor - 2 && checkMove(x + 1, y, "right")) {
      generatorHelper(x + 1, y);
    }
  } else if (direction == 3) {
    //Down
    if ((solved == false || y < vert - 2) && checkMove(x, y + 1, "down")) {
      generatorHelper(x, y + 1);
    }
  } else if (direction == 4) {
    //Left
    if (x > 1 && checkMove(x - 1, y, "left")) {
      generatorHelper(x - 1, y);
    }
  }
}

//Checks if the move is valid (if the coordinate and its adjacent locations are unvisited)
function checkMove(x, y, dir) {
  if (dir == "up") {
    if (
      maze[y][x] == 0 ||
      maze[y][x - 1] == 0 ||
      maze[y - 1][x - 1] == 0 ||
      maze[y - 1][x] == 0 ||
      maze[y - 1][x + 1] == 0 ||
      maze[y][x + 1] == 0
    ) {
      return false;
    }
  }
  if (dir == "down") {
    if (
      maze[y][x] == 0 ||
      maze[y][x + 1] == 0 ||
      maze[y + 1][x + 1] == 0 ||
      maze[y + 1][x] == 0 ||
      maze[y + 1][x - 1] == 0 ||
      maze[y][x - 1] == 0
    ) {
      return false;
    }
  }
  if (dir == "left") {
    if (
      maze[y][x] == 0 ||
      maze[y + 1][x] == 0 ||
      maze[y + 1][x - 1] == 0 ||
      maze[y][x - 1] == 0 ||
      maze[y - 1][x - 1] == 0 ||
      maze[y - 1][x] == 0
    ) {
      return false;
    }
  }
  if (dir == "right") {
    if (
      maze[y][x] == 0 ||
      maze[y - 1][x] == 0 ||
      maze[y - 1][x + 1] == 0 ||
      maze[y][x + 1] == 0 ||
      maze[y + 1][x + 1] == 0 ||
      maze[y + 1][x] == 0
    ) {
      return false;
    }
  }
  return true;
}

//Clears canvas
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

//Prints maze (without solution)
function printEmptyMaze() {
  context.fillStyle = "#000000";
  clearCanvas();
  for (let i = 0; i < vert; i++) {
    for (let j = 0; j < hor; j++) {
      if (maze[i][j] == 1) {
        context.fillRect(j * 16, i * 16, 16, 16);
      }
    }
  }
}

//Prints maze and solution
function printSolution() {
  printEmptyMaze();
  context.fillStyle = "#FF0000";
  for (let i = 0; i < directions.length; i++) {
    context.fillRect((directions[i][0] * 16), (directions[i][1] * 16), 16, 16);
  }
  solutionPrinted = true;
}
