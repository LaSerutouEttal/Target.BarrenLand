var x = 0;
var array = Array();

function add_element_to_array() {
  array[x] = document.getElementById("text1").value;
  //alert("Element: " + array[x] + " Added at index " + x);
  x++;
  document.getElementById("text1").value = "";
  this.display_array();
  this.main();
}

function display_array() {
  var e = "<hr/>";

  for (var y = 0; y < array.length; y++) {
    e += "Element " + y + " = " + array[y] + "<br/>";
  }
  document.getElementById("Result").innerHTML = e;
}

/***********************************************************************/


const WIDTH = 400;
const HEIGHT = 600;

const originalCoords = [
  [48, 192, 351, 207],
  [48, 392, 351, 407],
  [120, 52, 135, 547],
  [260, 52, 275, 547]
];

//var allCoords;;
var initialCoordObject = {
	x: 0,
  y: 0,
  touched: false
};
var allCoords = new Array(WIDTH).fill(initialCoordObject).map(() => new Array(HEIGHT).fill(initialCoordObject));
var fertileLand = [];

main();

function main(coords) {
  
  initialCoordinatePopulate(allCoords);
  
  printPartialCoordinateGrid(allCoords);
  
  printOriginalCoordinateGrid(originalCoords);
  
  console.log("trying to print barren coord: is it barren? " + allCoords[50][195].touched);
  console.log("trying to print barren coord: is it barren? " + allCoords[351][407].touched);
  console.log("trying to print barren coord: is it barren? " + allCoords[120][52].touched);
  console.log("trying to print barren coord: is it barren? " + allCoords[260][52].touched);
  
  //convertCoordArrayToObjectsAndTouchBarrenLand(allCoords);
  //fertileLand = returnFertileLand(fertileLand);
  
}

/*******************************************************/
function returnFertileLand(fertileLand) {
	var runningTotal = 0;
  var fertileLand = [];
	//iterate through entire array
  for(var i=0; i<WIDTH; i++) {
  	for(var j=0; i<HEIGHT; j++) {
    console.log("returnFertileLand");
    console.log("returnFertileLand: allCoords[i][j] - " + allCoords[i][j]);
    
    	var point = allCoords[i][j];
  		if(point.touched === false) {
      	var fertileArea = touchContiguousSpace(allCoords, i, j);
        fertileLand.add(fertileArea);
        returnFertileLand(fertileLand);
      }
      else {
      	break;
      }
  	}
  }
}


/**********************************************************************/

function initialCoordinatePopulate(inputCoords) {
  console.log("initialCoordinatePopulate");
  
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
    	//returns an object regardless of touched status
      var current = {
      	x: i,
        y: j,
        touched: false
      };
      
      let barren = false;
      
      for(let x=0; x<originalCoords.length; x++) {
        //console.log("checking originalCoords[" + x + "]");
        barren = checkIfBarren(originalCoords[x], i, j);
        if(barren) {
        	current.touched = true;
        }
      }
      
      //console.log(current.x);
      // push a coordinate onto allCoords regardless of touched or not
      allCoords[i][j] = current;
      
      //console.log("allCoords[i][j]: " + allCoords[i][j]);
    }
  }
}

function printPartialCoordinateGrid(inputCoords) {
	console.log("printPartialCoordinateGrid");
  for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 2; j++) {
        console.log("x: " + inputCoords[i][j].x + " y: " + inputCoords[i][j].y + " touched: " + inputCoords[i][j].touched);
      }
    }
}

function printOriginalCoordinateGrid(inputCoords) {
	console.log("printPartialCoordinateGrid");
  for (var i = 0; i < inputCoords.length; i++) {
      for (var j = 0; j < inputCoords[i].length; j++) {
        console.log(inputCoords[i][j]);
      }
    }
}

/* function touchBarrenLand(inputCoords, i, j) {
console.log("touchBarrenLand");
console.log("touchBarrenLand: inputCoords[i][j] - " + inputCoords[i][j]);
console.log("touchBarrenLand: inputCoords[i][j+1] - " + inputCoords[i][j+1]);

if (checkIfBarren(inputCoords[i], i, j)) {
    var current = {
      x: inputCoords[i][j],
      y: inputCoords[i][j + 1],
      touched: true
    }
    return current;
  } 
  else {
    console.log("not touching fertile land");
    var current = {
      x: inputCoords[i][j],
      y: inputCoords[i][j + 1],
      touched: false
    }
    return current;
  }
} */

/*****************************************************************/

//takes in one 4 coordinate set and the current 2 coordinate set and determines
//if the 2 coordinate set is inside the barren boundary or part of the barren axis
function checkIfBarren(inputCoords, i, j) {
  //format: [x1, y1, x2, y2]
  
  /* //x coordinate equal to x1 and y coordinate in range of y1 <= y <= y2
  var onLeftYAxis = i === inputCoords[0] && j >= inputCoords[1] && j <= inputCoords[3];
  
  //x coordinate equal to x2 and y coordinate in range of y1 <= y <= y2
  var onRightYAxis = i === inputCoords[2] && j >= inputCoords[1] && j <= inputCoords[3];
  
  //y coordinate equal to y1 and x coordinate in range of x1 <= x <= x2
  var onBottomXAxis = j === inputCoords[1] && i >= inputCoords[0] && i <= inputCoords[2];
  
  //y coordinate equal to y2 and x coordinate in range of x1 <= x <= x2
  var onTopXAxis = j === inputCoords[3] && i >= inputCoords[0] && i <= inputCoords[2]; */
  
  //y coordinate: y1 <= y <= y2 AND x coordinate: x1 <= x <= x2
  var insideBarrenBoundary = j <= inputCoords[3] && j >= inputCoords[1] && i >= inputCoords[0] && i <= inputCoords[2];
  if (insideBarrenBoundary) {
    return true;
  } else {
    return false;
  }
}

/***********************************************/

function touchContiguousSpace(fullSpace, x, y) {
	var count = 0;
  var contiguousStack = [];
  contiguousStack.push({x:x, y:y})
  
  while(!contiguousStack.length === 0) {
  	var point = contiguousStack.pop();
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
