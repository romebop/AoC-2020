import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const inputSlice = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(y => y.split(''));

const grid = [inputSlice];
printGrid(grid);
console.log('rotate once:');
printGrid(rotateGrid(grid));
console.log('rotate twice:');
printGrid(rotateGrid(rotateGrid(grid)));
console.log('rotate back');
printGrid(rotateGrid(rotateGrid(rotateGrid(grid))));

// const grid = padGrid([inputSlice]);
// printGrid(grid);

const numCycles = 6;

// console.log(solve(grid, numCycles));

// function solve(grid, numCycles) {
//   let currGrid = grid;
//   for (let cycle = 0; cycle < numCycles; cycle++) {
//     currGrid = runCycle(grid);
//   }
//   return getActiveCubes(currGrid);
// }

// function runCycle(grid) {

// }

function padGrid(grid) {
  let currGrid = grid;
  const dims = 3;
  for (let dim = 0; dim < dims; dim++) {
    if (sliceHasActive(currGrid[0])) {
      currGrid.unshift(getInitSlice(currGrid[0]));
    }
    if (sliceHasActive(currGrid[currGrid.length - 1])) {
      currGrid.push(getInitSlice(grid[0]));
    }
    currGrid = rotateGrid(currGrid);
  }
  return currGrid;
}

function sliceHasActive(slice) {
  for (let i = 0; i < slice.length; i++) {
    for (let j = 0; j < slice[0].length; j++) {
      if (slice[i][j] === '#') return true;
    }
  }
  return false;
}

function getInitSlice(slice) {
  return Array(slice.length).fill(
    Array(slice[0].length).fill('.')
  );
}

function rotateGrid(grid) {
  const zArr = [];
  for (let x = 0; x < grid[0][0].length; x++) {
    const yArr = [];
    for (let y = 0; y < grid[0].length; y++) {
      const xArr = [];
      for (let z = 0; z < grid.length; z++) {
        xArr.push(grid[z][y][x]);
      }
      yArr.push(xArr);
    }
    zArr.push(yArr);
  }
  return zArr;
}

function getNumActiveCubes(grid) {
  let count = 0;
  for (const slice of grid) {
    for (const row of slice) {
      for (const state of row) {
        if (state === State.ACTIVE) count++;
      }
    }
  }
  return count;
}

function printGrid(grid) {
  for (const slice of grid) {
    console.log('');
    for (const row of slice) {
      console.log(row.join(''));
    }
  }
}

const State = {
  ACTIVE: '#',
  INACTIVE: '.',
};