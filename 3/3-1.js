const fs = require('fs');

const inputFile = process.argv.slice(2)[0];

const map = fs.readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(line => line.split(''));

const slope = {
  right: 3,
  down: 1,
};

console.log(numTrees(map, slope));

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
