import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type Position = '.' | 'L' | '#';

const map: Position[][] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(s => s.split('') as Position[]);

console.log(solve(map));

function solve(map: Position[][]): number {
  let currentMap = map;
  let updatedMap = getUpdatedMap(map);
  while (!isSameMap(currentMap, updatedMap)) {
    currentMap = updatedMap;
    updatedMap = getUpdatedMap(currentMap);
  }
  return getOccupiedSeats(updatedMap);
}

function getUpdatedMap(map: Position[][]): Position[][] {
  const updatedMap: Position[][] = [];
  for (let y = 0; y < map.length; y++) {
    updatedMap.push([]);
    for (let x = 0; x < map[0].length; x++) {
      const currPosition: Position = map[y][x];
      const adjacentPositions: Position[] = getAdjacentPositions(map, y, x);
      if (
        currPosition === 'L'
        && !adjacentPositions.includes('#')
      ) updatedMap[y].push('#');
      else if (
        currPosition === '#'
        && adjacentPositions.filter(p => p === '#').length >= 4
      ) updatedMap[y].push('L');
      else updatedMap[y].push(currPosition);
    }
  }
  return updatedMap;
}

function getAdjacentPositions(map: Position[][], y: number, x: number): Position[] {
  const adjacentPositions = [];
  for (let i = y - 1; i <= y + 1; i++) {
    for (let j = x - 1; j <= x + 1; j++) {
      if (y === i && x === j) continue;
      if (!isOutOfBounds(map, i, j)) adjacentPositions.push(map[i][j]);
    }
  }
  return adjacentPositions as Position[];
}

function isOutOfBounds(map: Position[][], y: number, x: number): boolean {
  return (y < 0 || y >= map.length)
    || (x < 0 || x >= map[0].length);
}

function isSameMap(map1: Position[][], map2: Position[][]): boolean {
  return JSON.stringify(map1) === JSON.stringify(map2);
}

function getOccupiedSeats(map: Position[][]): number {
  let occupiedSeatCount = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '#') occupiedSeatCount++;
    }
  }
  return occupiedSeatCount;
}

function printMap(map: Position[][]): void {
  let strMap = '';
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      strMap += map[y][x];
    }
    strMap += '\n';
  }
  console.log(strMap);
}
