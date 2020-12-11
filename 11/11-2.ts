import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type Position = '.' | 'L' | '#';

const map: Position[][] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(s => s.split('') as Position[]);

console.log(solve(map));

function solve(map: Position[][]) {
  let currentMap = map;
  let updatedMap = getUpdatedMap(map);
  // printMap(updatedMap);
  while (!isSameMap(currentMap, updatedMap)) {
    currentMap = updatedMap;
    updatedMap = getUpdatedMap(currentMap);
    // printMap(updatedMap);
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
  const hasLeft = x - 1 >= 0;
  const hasRight = x + 1 < map[0].length;
  const hasTop = y - 1 >= 0;
  const hasBottom = y + 1 < map.length;
  if (hasTop) adjacentPositions.push(map[y - 1][x]);
  if (hasTop && hasRight) adjacentPositions.push(map[y - 1][x + 1]);
  if (hasRight) adjacentPositions.push(map[y][x + 1]);
  if (hasBottom && hasRight) adjacentPositions.push(map[y + 1][x + 1]);
  if (hasBottom) adjacentPositions.push(map[y + 1][x]);
  if (hasBottom && hasLeft) adjacentPositions.push(map[y + 1][x - 1]);
  if (hasLeft) adjacentPositions.push(map[y][x - 1]);
  if (hasTop && hasLeft) adjacentPositions.push(map[y - 1][x - 1]);
  return adjacentPositions as Position[];
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
