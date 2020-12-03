const fs = require('fs');

try {
  const dataArr = fs.readFileSync('1.input.txt', 'utf8')
    .split('\r\n')
    .map(e => +e);
  console.log(solve(dataArr));
} catch (err) {
  console.error(err);
}

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
