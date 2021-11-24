const fs = require('fs');

const inputFile = process.argv.slice(2)[0];

const dataArr = fs.readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e);

console.log(solve(dataArr));

function solve(arr) {
  console.log('length', arr.length);
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      for (let k = j + 1; k < arr.length; k++) {
        console.log('i', i);
        const sum = arr[i] + arr[j] + arr[k];
        if (sum === 2020) {
          return arr[i] * arr[j] * arr[k];
        }
      }
    }
  }
  return -1;
}
