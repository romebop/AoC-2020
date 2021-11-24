const fs = require('fs');

const inputFile = process.argv.slice(2)[0];

const dataArr = fs.readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e);

console.log(solve(dataArr));

function solve(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const sum = arr[i] + arr[j];
      if (sum === 2020) {
        return arr[i] * arr[j];
      }
    }
  }
  return -1;
}
