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
