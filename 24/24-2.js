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

const numDays = 100;

console.log(solve(tileDirs, dirMap, numDays));

function solve(tileDirs, dirMap, numDays) {
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
    const tile = serializeXY(currX, currY);
    flipTile(tile, blackTiles)
  });
  for (let i = 0; i < numDays; i++) {
    const flipTiles = new Set();
    for (const blackTile of blackTiles) {
      const numBlackAdj = getNumBlackAdj(blackTile, blackTiles, dirMap);
      if (numBlackAdj === 0 || numBlackAdj > 2) {
        flipTiles.add(blackTile);
      }
      const adjTiles = getAdjTiles(blackTile, dirMap);
      for (const adjTile of adjTiles) {
        if (blackTiles.has(adjTile) || flipTiles.has(adjTile)) continue;
        const numBlackAdj = getNumBlackAdj(adjTile, blackTiles, dirMap);
        if (numBlackAdj === 2) {
          flipTiles.add(adjTile);
        }
      }
    }
    for (const tile of flipTiles) {
      flipTile(tile, blackTiles);
    }
  }
  return blackTiles.size;
}

function getNumBlackAdj(tile, blackTiles, dirMap) {
  const [x, y] = deserializeXY(tile);
  let count = 0;
  for (const dir in dirMap) {
    const adjX = x + dirMap[dir].x;
    const adjY = y + dirMap[dir].y;
    if (blackTiles.has(serializeXY(adjX, adjY))) count++;
  }
  return count;
}

function getAdjTiles(tile, dirMap) {
  let [x, y] = deserializeXY(tile);
  return Object.keys(dirMap).map(dir =>
    serializeXY(x + dirMap[dir].x, y + dirMap[dir].y)
  );
}

function flipTile(tile, blackTiles) {
  if (blackTiles.has(tile)) {
    blackTiles.delete(tile);
  } else {
    blackTiles.add(tile);
  }
}

function deserializeXY(str) {
  return str.split(',').map(e => +e);
}

function serializeXY(x, y) {
  return `${x},${y}`;
}