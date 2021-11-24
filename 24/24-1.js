import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const tileDirs = readFileSync(inputFile, 'utf8')
  .split('\n');

const dirMap = {
  e: { x: 1, y: 0 },
  se: { x: 0.5, y: -1 },
  sw: { x: -0.5, y: -1 },
  w: { x: -1, y: 0 },
  nw: { x: -0.5, y: 1 },
  ne: { x: 0.5, y: 1 },
};

console.log(solve(tileDirs, dirMap));

function solve(tileDirs, dirMap) {
  const blackTiles = new Set();
  tileDirs.forEach(tileDir => {
    let currDir = '';
    let currX = 0;
    let currY = 0;
    for (let i = 0; i < tileDir.length; i++) {
      currDir += tileDir[i];
      if (dirMap.hasOwnProperty(currDir)) {
        currX += dirMap[currDir].x;
        currY += dirMap[currDir].y;
        currDir = '';
      }
    }
    const tile = `${currX},${currY}`;;
    if (blackTiles.has(tile)) {
      blackTiles.delete(tile);
    } else {
      blackTiles.add(tile);
    }
  });
  return blackTiles.size;
}