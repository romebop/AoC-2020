const fs = require('fs');

try {
  const map = fs.readFileSync('3.input.txt', 'utf8')
    .split('\r\n')
    .map(line => line.split(''));

  const slope = {
    right: 3,
    down: 1,
  };

  console.log(numTrees(map, slope));
} catch (err) {
  console.error(err);
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
