var container = document.querySelector(".container");
var grid = document.querySelector(".grid");
var matrix = [];
var GRID_ROWS = 40;
var GRID_COLS = 80;
var FILLED_BG = "red";

/**
 * @param {integer} index The index of the element in a row-major order
 * @returns [row, col] - Row and column of the element with the given index
 */
const getRowAndColFromIndex = (index) => {
  let col = index % GRID_COLS;
  let row = parseInt(index / GRID_COLS);
  return [row, col];
};

/**
 * Returns the row-major index of the element with given row, col.
 * @param {integer} row
 * @param {integer} col
 * @returns index
 */
const getIndexFromRowAndCol = (row, col) => {
  return index * row + col;
};

/**
 * Get the row and column number from the grid cell classname. e.g. className = 'grid-item r01c20' => [row, col] = [1,20]
 * @param {string} name
 * @returns [row, col] (or [0,0] if error occurs)
 */
const getRowAndColFromClassName = (name) => {
  let rowRegex = /r(?:(\d+))/g;
  let colRegex = /c(?:(\d+))/g;

  let rowMatch = rowRegex.exec(name);
  let colMatch = colRegex.exec(name);

  try {
    return [parseInt(rowMatch[1]), parseInt(colMatch[1])];
  } catch (error) {
    return [0, 0];
  }
};

/**
 * Toggle the color of the grid cell that was clicked, and update the matrix accordingly.
 *
 * @param {HTMLDivElement} element
 */
const squareOnClick = (element) => {
  let elementClassName = element.className;
  let [row, col] = getRowAndColFromClassName(elementClassName);

  if (matrix[row][col] === true) {
    matrix[row][col] = false;
    element.style.backgroundColor = null;
  } else {
    matrix[row][col] = true;
    element.style.backgroundColor = FILLED_BG;
  }
};

/**
 * Create a GRID_ROW * GRID_COLS size grid.
 */
const createBoard = () => {
  let root = document.querySelector(":root");

  root.style.setProperty("--grid-cols", `${GRID_COLS}`);
  root.style.setProperty("--grid-rows", `${GRID_ROWS}`);

  //Initialize the matrix to keep state
  for (var i = 0; i < GRID_ROWS; i++) {
    matrix[i] = [];
    for (var j = 0; j < GRID_COLS; j++) {
      matrix[i][j] = false;
    }
  }

  //Add grid cells to the parent
  for (var i = 0; i < GRID_ROWS * GRID_COLS; i++) {
    let div = document.createElement("div");
    div.classList.add("grid-item");

    var [row, col] = getRowAndColFromIndex(i);
    div.classList.add(`r${row}c${col}`);

    div.addEventListener("click", (e) => {
      squareOnClick(e.target);
    });
    grid.appendChild(div);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  createBoard(GRID_ROWS, GRID_COLS);
});
