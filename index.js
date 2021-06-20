var startStopToggle = document.querySelector("#start-stop-toggle");
var rowInput = document.querySelector("#row-input");
var colInput = document.querySelector("#col-input");
var reset = document.querySelector("#reset");
var grid = document.querySelector(".grid");
var intervalInputLabel = document.querySelector("#interval-input-label");
var intervalInput = document.querySelector("#interval-input");
var generationSpan = document.querySelector(".generation");

var generationCounter = 0;
var started = false;
var interval = null;
var currentTimeInterval = 0;
var currentGridRows = 0;
var currentGridCols = 0;

const GRID_ROWS_DEFAULT = 25;
const GRID_COLS_DEFAULT = 50;
const INTERVAL_DEFAULT = 1000;
const FILLED_BG = "red";

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

    //Initialize a matrix to keep state
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

  /**
   * Update the Board's UI based on the Matrix's state.
   */
  updateBoard = () => {
    for (var i = 0; i < this.grid_rows; i++) {
      for (var j = 0; j < this.grid_cols; j++) {
        let cell = document.getElementsByClassName(`r${i}c${j}`)[0];

        if (this.matrix[i][j] === 0) {
          cell.style.backgroundColor = null;
        } else if (this.matrix[i][j] === 1) {
          cell.style.backgroundColor = FILLED_BG;
        }
      }
    }
  };

  /**
   * Check the rules of the game and see which cell gets to live and which one doesn't.
   */
  incrementGeneration = () => {
    let newMat = [];

    for (var row = 0; row < this.grid_rows; row++) {
      newMat[row] = [];
      for (var col = 0; col < this.grid_cols; col++) {
        newMat[row][col] = 0;

        //To make sure that we dont go out of bounds
        let rowNeighbourStart = row > 0 ? -1 : 0;
        let colNeightbourStart = col > 0 ? -1 : 0;

        //To make sure that we dont go out of bounds
        let rowNeighbourEnd = row < this.grid_rows - 1 ? 1 : 0;
        let colNeighbourEnd = col < this.grid_cols - 1 ? 1 : 0;

        let numberOfAliveNeighbours = 0;

        //Go through the neighbours to check which cells are alive
        for (var i = rowNeighbourStart; i <= rowNeighbourEnd; i++) {
          for (var j = colNeightbourStart; j <= colNeighbourEnd; j++) {
            if (i !== 0 || j !== 0) {
              numberOfAliveNeighbours += this.matrix[row + i][col + j];
            }
          }
        }

        //Check the rules.
        if (this.matrix[row][col] === 1) {
          if (numberOfAliveNeighbours === 2 || numberOfAliveNeighbours === 3) {
            newMat[row][col] = 1;
          }
        } else if (this.matrix[row][col] === 0) {
          if (numberOfAliveNeighbours === 3) {
            newMat[row][col] = 1;
          }
        }
      }
    }

    //Replace the old matrix with the newone
    this.matrix = newMat;

    //Update board
    this.updateBoard();
  };
}

/**
 * Resets the board
 * @returns {GameBoard}
 */
const resetBoard = () => {
  grid.innerHTML = "";
  board = new GameBoard(currentGridRows, currentGridCols);
  return board;
};

/**
 * Start the Game of Life
 * @param {GameBoard} board
 */
const start = (board) => {
  started = true;

  startStopToggle.classList.remove("btn-success");
  startStopToggle.classList.add("btn-danger");

  startStopToggle.innerHTML = "Stop";

  rowInput.setAttribute("disabled", "true");
  colInput.setAttribute("disabled", "true");
  intervalInput.setAttribute("disabled", "true");

  interval = setInterval(() => {
    board.incrementGeneration();
    generationCounter++;
    generationSpan.innerHTML = generationCounter;
  }, currentTimeInterval);
};

/**
 * Stop the Game of Life.
 * @param {GameBoard} board
 */
const stop = (board) => {
  started = false;

  startStopToggle.classList.remove("btn-danger");
  startStopToggle.classList.add("btn-success");

  startStopToggle.innerHTML = "Start";

  rowInput.removeAttribute("disabled");
  colInput.removeAttribute("disabled");
  intervalInput.removeAttribute("disabled");

  clearInterval(interval);
};

const toggleStarted = (board) => {
  if (started) {
    stop(board);
  } else {
    start(board);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  currentGridRows = GRID_ROWS_DEFAULT;
  currentGridCols = GRID_COLS_DEFAULT;
  currentTimeInterval = INTERVAL_DEFAULT;

  var board = new GameBoard(currentGridRows, currentGridCols);

  rowInput.addEventListener("change", (e) => {
    var val = parseInt(e.target.value);
    if (val > 0) {
      currentGridRows = parseInt(val);
      board = resetBoard();
    } else {
      currentGridRows = GRID_ROWS_DEFAULT;
      board = resetBoard();
    }
  });

  colInput.addEventListener("change", (e) => {
    var val = parseInt(e.target.value);
    if (val > 0) {
      currentGridCols = parseInt(val);
      board = resetBoard();
    } else {
      currentGridCols = GRID_COLS_DEFAULT;
      board = resetBoard();
    }
  });

  rowInput.setAttribute("placeholder", GRID_ROWS_DEFAULT);
  colInput.setAttribute("placeholder", GRID_COLS_DEFAULT);

  startStopToggle.addEventListener("click", () => {
    toggleStarted(board);
  });

  reset.addEventListener("click", () => {
    currentGridRows = GRID_ROWS_DEFAULT;
    currentGridCols = GRID_COLS_DEFAULT;

    rowInput.value = "";
    colInput.value = "";

    stop(board);

    intervalInputLabel.innerHTML = `Interval (${currentTimeInterval}ms)`;
    intervalInput.setAttribute("value", currentTimeInterval);

    generationCounter = 0;
    generationSpan.innerHTML = generationCounter;

    resetBoard();
  });

  intervalInputLabel.innerHTML = `Interval (${currentTimeInterval}ms)`;
  intervalInput.setAttribute("value", currentTimeInterval);

  intervalInput.addEventListener("input", (e) => {
    currentTimeInterval = e.target.value;
    intervalInputLabel.innerHTML = `Interval (${currentTimeInterval}ms)`;
  });
});
