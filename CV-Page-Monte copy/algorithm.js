
function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == elt) {
        arr.splice(i, 1);
      }
    }
  }
  
function startAStar(){
  greenflag = greenflag ? false : true;
}


  // An educated guess of how far it is between two points
  function heuristic(a, b) {
    var d = dist(a.i, a.j, b.i, b.j);
    return d;
  }
  




  // How many columns and rows?
  var cols = 50;
  var rows = 50;
  
  // This will be the 2D array
  var grid = new Array(cols);
  
  // Open and closed set
  var openSet = [];
  var closedSet = [];
  
  // Start and end
  var start;
  var end;
  
  // Width and height of each cell of grid
  var w, h;
  
  // The road taken
  var path = [];
  
  let greenflag = false;




  function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent('path');

    
    // Grid cell size
    w = width / cols;
    h = height / rows;
  
    // Making a 2D array
    for (var i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
    }
  
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }
  
    // All the neighbors
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].addNeighbors(grid);
      }
    }
  
    // Start and end
    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    start.wall = false;
    end.wall = false;
  
    // openSet starts with beginning only
    openSet.push(start);
  }
  







  function draw() {
    if (greenflag){
      stroke(0);
    fill(255,255,255,0);
    rect(1,1,399,399);

  
    // Am I still searching?
    if (openSet.length > 0) {
      // Best next option
      var winner = 0;
      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      var current = openSet[winner];
  
      // Did I finish?
      if (current === end) {
        greenflag=false;
        noLoop();
        console.log('DONE!');
      }
  
      // Best option moves from openSet to closedSet
      removeFromArray(openSet, current);
      closedSet.push(current);
  
      // Check all the neighbors
      var neighbors = current.neighbors;
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
  
        // Valid next spot?
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          var tempG = current.g + heuristic(neighbor, current);
  
          // Is this a better path than before?
          var newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }
  
          // Yes, it's a better path
          if (newPath) {
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
      }
      // Uh oh, no solution
    } else {
      console.log('no solution');
      noLoop();
      greenflag = false;
      return;
    }
  
    // Draw current state of everything

  
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].show();
      }
    }
  
    for (var i = 0; i < closedSet.length; i++) {
      closedSet[i].show(color(255, 0, 0,15));
    }
  
    for (var i = 0; i < openSet.length; i++) {
      openSet[i].show(color(0,0,255,15));
    }
  
    // Find the path by working backwards
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
  
    // for (var i = 0; i < path.length; i++) {
    // path[i].show(color(0, 0, 255));
    //}
  
    // Drawing path as continuous line
    noFill();
    stroke(255, 255, 0);
    strokeWeight(w / 3);
    beginShape();
    for (var i = 0; i < path.length; i++) {
      vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
    }
    endShape();
    }
  }
