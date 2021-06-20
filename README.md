# Game of Life simulation 🤖

View live demo [here](https://conways-game-of-life-by-shash.herokuapp.com/).

The **Game of Life** devised by the British mathematician [John Conway](https://en.wikipedia.org/wiki/John_Horton_Conway) is played on a 2D grid. Each cell in the grid can either be alive, or dead. After a set interval, a new generation is created wherein the fate of each cell in the previous generation is decided by a few rules.

- Any live cell with fewer than two live neighbours dies, as if by underpopulation.
- Any live cell with two or three live neighbours lives on to the next generation.
- Any live cell with more than three live neighbours dies, as if by overpopulation.
- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

These rules allow for some populations to die off quickly while some others to prevail till the end of time. Nevertheless, the populations do generate wonderful patterns on the canvas to play around with!

## Run Locally

1. Clone the repository ([clone link](https://github.com/shashwatrathod/conways-game-of-life.git)).
2. Open index.html in any ES6 compatible browser.

## Demo/Examples

You can view the live demo [here](https://conways-game-of-life-by-shash.herokuapp.com/).

To play the simulation:

- (Optional) Change the grid size\
 ![Changing grid size](/images/grid.png) \
 (Default : 25 \* 50)
- (Optional) Set the interval between two generations.\
 ![Set interval](images/interval.png) \
 (Default : 1000ms)
- Click on the cells to populate/unpopulate them.
- Press start for the fun to begin!

Here are some awesome patterns:

![Square pattern](/images/square.gif)

![Infinite pattern](/images/infinite.gif)

You can find more patterns [here](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#:~:text=10-,examples%20of%20patterns,-edit).

## References

1. https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
2. http://pi.math.cornell.edu/~lipa/mec/lesson6.html
