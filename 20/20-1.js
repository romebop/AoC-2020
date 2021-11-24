import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const tileIdRegex = /^Tile (?<id>\d+):$/;

const tiles = readFileSync(inputFile, 'utf8')
  .split('\n\n')
  .map(rawTileInput => {
    const lines = rawTileInput.split('\n');
    const id = lines[0].match(tileIdRegex).groups.id;
    const pixels = lines.slice(1).map(line => line.split(''));
    const topBorder = [...pixels[0]];
    const rightBorder = [];
    for (let i = 0; i < pixels.length; i++) {
      rightBorder.push(pixels[i][pixels.length - 1]);
    }
    const bottomBorder = [...pixels[pixels.length - 1]];
    const leftBorder = [];
    for (let i = 0; i < pixels.length; i++) {
      leftBorder.push(pixels[i][0]);
    }
    const borders = [topBorder, rightBorder, bottomBorder, leftBorder];
    return { id, borders };
  });

console.log(solve(tiles));

function solve(tiles) {
  const cornerIds = [];
  for (let i = 0; i < tiles.length; i++) {
    const thisTile = tiles[i];
    let count = 0;
    for (let j = 0; j < tiles.length; j++) {
      if (i === j) continue;
      const thatTile = tiles[j];
      if (doesTileMatch(thisTile, thatTile)) count++;
    }
    if (count === 2) cornerIds.push(thisTile.id);
  }
  return cornerIds.reduce((product, id) => product * id, 1);
}

function doesTileMatch(tile1, tile2) {
  for (const border1 of tile1.borders) {
    for (const border2 of tile2.borders) {
      if (
        doesBorderMatch(border1, border2)
        || doesBorderMatch(border1, border2.slice().reverse())
      ) return true;
    }
  }
  return false;
}

function doesBorderMatch(border1, border2) {
  for (let i = 0; i < border1.length; i++) {
    if (border1[i] !== border2[i]) return false;
  }
  return true;
}