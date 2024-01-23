# Pseudocode

HTML connections

- event listeners for all buttons

- canvas element

- inputs

Global variables

let current_maze = empty 2d array

let path = array of coordinates

Functions:

generateMaze() {
  get width and height from html

let starting_coordinates = [width/2, 0]

}

generateMazeHelper() {

}

solveMaze() {
  let starting_coordinates = [x,y]
  let path = []
  solveMazeHelper([x,y])
  
  
}

solveMazeHelper(coordinates,prev_coords) {

  Base case: square is a wall

  Base case: Square is at bottom (solved)


  if (up != edge) {
    if (solveMazeHelper(x, y + 1) == true)
    path.push(coordinates);
    return true;
  }

  if (down != edge) {
    if (solveMazeHelper(x, y - 1) == true)
    path.push(coordinates);
    return true;
  }  

  if (left != edge) {
    if (solveMazeHelper(x - 1, y) == true)
    path.push(coordinates);
    return true;
  } 

  if (right != edge) {
    if (solveMazeHelper(x + 1, y) == true)
    path.push(coordinates);
    return true;
  }

  
  
}

//After coordinates array is created, simple function to print to canvas (loop, multiply coordinate shifts by x)
