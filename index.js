var startStopToggle = document.querySelector("#start-stop-toggle");
var GRID_ROWS = 40;
var GRID_COLS = 80;
var FILLED_BG = "red";

class GameBoard {
  constructor(grid_rows, grid_cols) {
    this.grid_rows = grid_rows;
    this.grid_cols = grid_cols;
    this.started = false;

    this.container = document.querySelector(".container");
    this.grid = document.querySelector(".grid");

    //Set grid size
    let root = document.querySelector(":root");

    root.style.setProperty("--grid-cols", `${this.grid_cols}`);
    root.style.setProperty("--grid-rows", `${this.grid_rows}`);

    //Initialize the matrix to keep state
    this.matrix = [];
    for (var i = 0; i < this.grid_rows; i++) {
      this.matrix[i] = [];
      for (var j = 0; j < this.grid_cols; j++) {
        this.matrix[i][j] = 0;
      }
    }

    this.createBoard();
  }

  /**
   * @param {integer} index The index of the element in a row-major order
   * @returns [row, col] - Row and column of the element with the given index
   */
  getRowAndColFromIndex = (index) => {
    let col = index % this.grid_cols;
    let row = parseInt(index / this.grid_cols);
    return [row, col];
  };

  /**
   * Returns the row-major index of the element with given row, col.
   * @param {integer} row
   * @param {integer} col
   * @returns index
   */
  getIndexFromRowAndCol = (row, col) => {
    return index * row + col;
  };

  /**
   * Get the row and column number from the grid cell classname. e.g. className = 'grid-item r01c20' => [row, col] = [1,20]
   * @param {string} name
   * @returns [row, col] (or [0,0] if error occurs)
   */
  getRowAndColFromClassName = (name) => {
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
  squareOnClick = (element) => {
    let elementClassName = element.className;
    let [row, col] = this.getRowAndColFromClassName(elementClassName);

    if (this.matrix[row][col] === 1) {
      this.matrix[row][col] = 0;
      element.style.backgroundColor = null;
    } else {
      this.matrix[row][col] = 1;
      element.style.backgroundColor = FILLED_BG;
    }
  };

  /**
   * Create a GRID_ROW * GRID_COLS size grid.
   */
  createBoard = () => {
    //Add grid cells to the parent
    for (var i = 0; i < this.grid_rows * this.grid_cols; i++) {
      let div = document.createElement("div");
      div.classList.add("grid-item");

      var [row, col] = this.getRowAndColFromIndex(i);
      div.classList.add(`r${row}c${col}`);

      div.addEventListener("click", (e) => {
        this.squareOnClick(e.target);
      });
      this.grid.appendChild(div);
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  var board = new GameBoard(GRID_ROWS, GRID_COLS);
});
