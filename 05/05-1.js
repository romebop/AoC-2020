const fs = require('fs');

const inputFile = process.argv.slice(2)[0];

const rowNum = 128;
const columnNum = 8;

const boardingPasses = fs.readFileSync(inputFile, 'utf8')
  .split('\n');

console.log(solve(boardingPasses));

function solve(boardingPasses) {
  return boardingPasses.map(getSeatId)
    .reduce((acc, curr) => Math.max(acc, curr));
}

function getSeatId(boardingPass) {
  let [rowLowerBound, rowUpperBound] = getBounds(rowNum);
  let [columnLowerBound, columnUpperBound] = getBounds(columnNum);
  for (const char of boardingPass) {
    if (char === 'F') {
      rowUpperBound -= Math.floor((rowUpperBound - rowLowerBound) / 2);
    }
    if (char === 'B') {
      rowLowerBound += Math.ceil((rowUpperBound - rowLowerBound) / 2);
    }
    if (char === 'L') {
      columnUpperBound -= Math.floor((columnUpperBound - columnLowerBound) / 2);
    }
    if (char === 'R') {
      columnLowerBound += Math.ceil((columnUpperBound - columnLowerBound) / 2);
    }
  }
  return (rowLowerBound * columnNum) + columnLowerBound;
}

function getBounds(n) {
  return [0, n - 1];
}
