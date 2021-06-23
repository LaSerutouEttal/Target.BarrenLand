const WIDTH = 400;
const HEIGHT = 600;

// a test array of given barren land coordinates.
const originalCoords = [
  [48, 192, 351, 207],
  [48, 392, 351, 407],
  [120, 52, 135, 547],
  [260, 52, 275, 547]
];

let initialCoordObject = {
  x: 0,
  y: 0,
  touched: false
};

// allCoords represents the full coordinates of the farm as a 2D array of objects.
// populate allCoords with objects that have default values. 
let allCoords = new Array(WIDTH).fill(initialCoordObject).map(() => new Array(HEIGHT).fill(initialCoordObject));
let fertileLand = [];

main();

function main() {
  
  initialCoordinatePopulate(allCoords);
  
  printPartialCoordinateGrid(allCoords);
  
  printOriginalCoordinateGrid(originalCoords);
  
  //minor tests (not the test cases listed in documentation)
  console.log("trying to print barren coord: is it barren? " + allCoords[50][195].touched);
  console.log("trying to print barren coord: is it barren? " + allCoords[351][407].touched);
  console.log("trying to print barren coord: is it barren? " + allCoords[120][52].touched);
  console.log("trying to print barren coord: is it barren? " + allCoords[260][52].touched);
  
  fertileLand = returnFertileLand(fertileLand);
}

/**
 * Traverses the farm and adds discrete areas of fertile land to the fertileLand array.
 * Prints the results as a string, sorted from largest to smallest.  
 */
function returnFertileLand() {
  let resultSet = "";
  for(let i=0; i<WIDTH; i++) {
  	for(let j=0; i<HEIGHT; j++) {
    	let point = allCoords[i][j];
  		if(point.touched === false) {
      	let fertileArea = touchContiguousSpace(allCoords, i, j);
        fertileLand.add(fertileArea);
        returnFertileLand(fertileLand);
      }
      else {
      	break;
      }
  	}
  }
  if(fertileLand.length === 0) {
      console.log("There is no fertile land.");
  }
  else {
      // only sort fertile land if array is populated
      fertileLand = fertileLand.sort(function(a, b){return b-a});
      for(let i=0; i<fertileLand.length; i++) {
        resultSet += " " + fertileLand[i];
      }
      console.log(resultSet);
  }
}

/**
 * Loops through all coordinates, checks if they are within barren land.
 * Initializes a point object. Sets the "touched" property to true if the coordinates are in a barren area.
 */
function initialCoordinatePopulate() {
  console.log("initialCoordinatePopulate");
  
    
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      let current = {
      	x: i,
        y: j,
        touched: false
      };
      
      let barren = false;
      
      for(let x=0; x<originalCoords.length; x++) {
        barren = checkIfBarren(originalCoords[x], i, j);
        if(barren) {
        	current.touched = true;
        }
      }
      
      // populate point regardless of barren status
      allCoords[i][j] = current;
    }
  }
}

/**
 * Returns "true" if given point is within the bounds of an area of barren land.
 * @param {array} inputCoords - array of 4 numbers, the two points representing bottom-left and top-right coordinates
 * @param {number} i: the x coordinate of a point to check
 * @param {number} j: the y coordinate of a point to check
 */
function checkIfBarren(inputCoords, i, j) {
  //format: [x1, y1, x2, y2]
  
  //y coordinate: y1 <= y <= y2 AND x coordinate: x1 <= x <= x2
  let insideBarrenBoundary = j <= inputCoords[3] && j >= inputCoords[1] && i >= inputCoords[0] && i <= inputCoords[2];
  if (insideBarrenBoundary) {
    return true;
  } else {
    return false;
  }
}

/**
 * Logic for filling and counting fertile land.
 * @param {array} fullSpace - full farm area
 * @param {number} x - first x coordinate of a fertile area
 * @param {number} y - first y coordinate of a fertile area
 */
function touchContiguousSpace(fullSpace, x, y) {
	let count = 0;
  let contiguousStack = [];
  contiguousStack.push({x:x, y:y})
  
  while(!contiguousStack.length === 0) {
  	let point = contiguousStack.pop();
  	if(isPointUntouched(fullSpace, point)) {
    	count++;
      
      console.log("isPointUntouched: trying fullSpace[point.x][point.y-1].touched - " + fullSpace[point.x][point.y-1].touched);
      if(point.y-1 >= 0 && !fullSpace[point.x][point.y-1].touched) {
      	contiguousStack.push({x:x, y:y-1});
      }
      
      console.log("isPointUntouched: trying fullSpace[point.x][point.y].touched - " + fullSpace[point.x][point.y+1].touched);
      if(point.y+1 < WIDTH && !fullSpace[point.x][point.y+1].touched) {
      	contiguousStack.push({x:x, y:y+1});
      }
      
      console.log("isPointUntouched: trying fullSpace[point.x][point.y].touched - " + fullSpace[point.x-1][point.y].touched);
      if(point.x-1 >= 0 && !fullSpace[point.x-1][point.y].touched) {
      	contiguousStack.push({x:x-1, y:y});
      }
      
      console.log("isPointUntouched: trying fullSpace[point.x][point.y].touched - " + fullSpace[point.x+1][point.y].touched);
      if(point.x+1 < HEIGHT && !fullSpace[point.x+1][point.y].touched) {
      	contiguousStack.push({x:x+1, y:y});
      }
    }
  }
  return count; 
}

function isPointUntouched(fullSpace, c) {
	console.log("isPointUntouched: trying fullSpace[point.x][point.y].touched - " + fullSpace[point.x][point.y].touched);
	if(fullSpace[point.x][point.y].touched) {
  	return false;
  }
  else {
    fullSpace[point.x][point.y].touched = true;
    return true;
  }
}

/**
 * Page control logic / helpers
 */
 let x = 0;
 let array = Array();
 
 function add_element_to_array() {
   array[x] = document.getElementById("coordinates").value;
   x++;
   document.getElementById("coordinates").value = "";
   this.display_array();
   this.main();
 }
 
 function display_array() {
   let e = "<hr/>";
 
   for (let y = 0; y < array.length; y++) {
     e += "Element " + y + " = " + array[y] + "<br/>";
   }
   document.getElementById("Result").innerHTML = e;
 }

 /**
  * Helper and debug functions
  */
function printPartialCoordinateGrid(inputCoords) {
	console.log("printPartialCoordinateGrid");
  for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        console.log("x: " + inputCoords[i][j].x + " y: " + inputCoords[i][j].y + " touched: " + inputCoords[i][j].touched);
      }
    }
}

function printOriginalCoordinateGrid(inputCoords) {
	console.log("printPartialCoordinateGrid");
  for (let i = 0; i < inputCoords.length; i++) {
      for (let j = 0; j < inputCoords[i].length; j++) {
        console.log(inputCoords[i][j]);
      }
    }
}