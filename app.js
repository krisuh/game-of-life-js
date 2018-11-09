(function() {
  function createGrid(elementId, xLength, yLength) {
    var rootElement = document.querySelector(elementId);
    var grid = [];
    for (var y = 0; y < yLength; y++) {
      grid[y] = [];
      var row = document.createElement("div");
      for (var x = 0; x < xLength; x++) {
        var cell = document.createElement("span");
        cell.className = "cell";
        cell.style = "";
        row.appendChild(cell);
        grid[y][x] = new Cell(cell, x, y, xLength, yLength);
        cell.addEventListener(
          "click",
          function(e) {
            e.preventDefault();
            this.alive = !this.alive;
            var styleStr = this.alive
              ? "background: black;"
              : "background: white;";
            this.cellElement.setAttribute("style", styleStr);
          }.bind(grid[y][x])
        );
      }
      rootElement.appendChild(row);
    }
    return grid;
  }

  function Cell(cellElement, x, y, xLength, yLength) {
    return {
      x: x,
      y: y,
      alive: false,
      cellElement: cellElement,
      nextState: false,
      adjacents: setAdjacentIndices(x, y, xLength - 1, yLength - 1)
    };
  }

  function Game() {
    var gameStarted = false;
    var grid = createGrid("#gamegrid", 50, 50);
    var handler = null;

    var startController = function() {
      if (!gameStarted) {
        handler = startGame(grid);
      } else {
        clearInterval(handler);
      }
      gameStarted = !gameStarted;
    };

    var next = function() {
      nextGeneration(grid);
    };

    var resetGrid = function() {
      resetGame(grid);
    };

    return {
      gameStarted: gameStarted,
      toggle: startController,
      nextStep: next,
      reset: resetGrid
    };
  }

  function setAdjacentIndices(x, y, limitY, limitX) {
    west = { x: x - 1, y: y };
    east = { x: x + 1, y: y };
    north = { x: x, y: y - 1 };
    south = { x: x, y: y + 1 };
    if (west.x < 0) {
      west.x = limitX;
    }
    if (east.x > limitX) {
      east.x = 0;
    }
    if (north.y < 0) {
      north.y = limitY;
    }
    if (south.y > limitY) {
      south.y = 0;
    }
    northEast = { x: east.x, y: north.y };
    northWest = { x: west.x, y: north.y };
    southEast = { x: east.x, y: south.y };
    southWest = { x: west.x, y: south.y };
    return [
      west,
      east,
      north,
      south,
      northEast,
      northWest,
      southEast,
      southWest
    ];
  }

  function determineNextState(cell, grid) {
    var adjacentsAlive = 0;
    cell.adjacents.forEach(function(adjacent) {
      if (grid[adjacent.y][adjacent.x].alive) {
        adjacentsAlive++;
      }
    });
    if (cell.alive) {
      if (adjacentsAlive < 2) {
        cell.nextState = false;
      }
      if (adjacentsAlive === 2 || adjacentsAlive === 3) {
        cell.nextState = true;
      }
      if (adjacentsAlive > 3) {
        cell.nextState = false;
      }
    } else {
      if (adjacentsAlive === 3) {
        cell.nextState = true;
      }
    }
  }

  function setNextState(cell) {
    cell.alive = cell.nextState;
    var styleStr = cell.alive ? "background: black;" : "background: white;";
    cell.cellElement.setAttribute("style", styleStr);
  }

  function resetCell(cell) {
    cell.alive = false;
    cell.nextState = false;
    cell.cellElement.setAttribute("style", "background: white;");
  }

  function nextGeneration(grid) {
    grid.forEach(function(row) {
      row.forEach(function(cell) {
        determineNextState(cell, grid);
      });
    });
    grid.forEach(function(row) {
      row.forEach(function(cell) {
        setNextState(cell);
      });
    });
  }

  function resetGame(grid) {
    grid.forEach(function(row) {
      row.forEach(function(cell) {
        resetCell(cell);
      });
    });
  }

  function startGame(grid) {
    return setInterval(function() {
      nextGeneration(grid);
    }, 50);
  }

  var game = new Game();

  var nextButton = document.querySelector("#next-btn");
  var resetButton = document.querySelector("#reset-btn");
  var startButton = document.querySelector("#start-btn");
  nextButton.addEventListener("click", function(e) {
    game.nextStep();
  });

  resetButton.addEventListener("click", function(e) {
    game.reset();
  });

  startButton.addEventListener("click", function(e) {
    toggleStartButtonText();
    game.toggle();
  });

  function toggleStartButtonText() {
    if (startButton.innerHTML === "Start") {
      startButton.innerHTML = "Pause";
    } else {
      startButton.innerHTML = "Start";
    }
  }
})();
