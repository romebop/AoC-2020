const fs = require('fs');

try {
  const map = fs.readFileSync('3.input.txt', 'utf8')
    .split('\r\n')
    .map(line => line.split(''));

  const slopes = [
    { right: 1, down: 1 },
    { right: 3, down: 1 },
    { right: 5, down: 1 },
    { right: 7, down: 1 },
    { right: 1, down: 2 },
  ];

  console.log(solve(map, slopes));
} catch (err) {
  console.error(err);
}

function solve(map, slopes) {
  return slopes.map(slope => numTrees(map, slope))
    .reduce((acc, curr) => acc * curr);
}

function numTrees(map, slope) {
  const mapWidth = map[0].length;
  let treeCount = 0;
  let xIdx = 0;
  let yIdx = 0;
  while (yIdx < map.length) {
    if (map[yIdx][xIdx] === '#') treeCount++;
    xIdx = (xIdx + slope.right) % mapWidth;
    yIdx += slope.down;
  }
  return treeCount;
}
