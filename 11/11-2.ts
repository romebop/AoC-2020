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
    // printMap(currentMap);
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
      const visibleOccupiedSeats = getVisibleOccupiedSeats(map, y, x);
      if (
        currPosition === 'L'
        && visibleOccupiedSeats === 0
      ) updatedMap[y].push('#');
      else if (
        currPosition === '#'
        && visibleOccupiedSeats >= 5
      ) updatedMap[y].push('L');
      else updatedMap[y].push(currPosition);
    }
  }
  return updatedMap;
}

function getVisibleOccupiedSeats(map: Position[][], y: number, x: number): number {
  let visibleOccupiedSeats = 0;
  if (seesVisibleSeat(map, y, x, 1, 0)) visibleOccupiedSeats += 1;
  if (seesVisibleSeat(map, y, x, 1, 1)) visibleOccupiedSeats += 1;
  if (seesVisibleSeat(map, y, x, 0, 1)) visibleOccupiedSeats += 1;
  if (seesVisibleSeat(map, y, x, -1, 1)) visibleOccupiedSeats += 1;
  if (seesVisibleSeat(map, y, x, -1, 0)) visibleOccupiedSeats += 1;
  if (seesVisibleSeat(map, y, x, -1, -1)) visibleOccupiedSeats += 1;
  if (seesVisibleSeat(map, y, x, 0, -1)) visibleOccupiedSeats += 1;
  if (seesVisibleSeat(map, y, x, 1, -1)) visibleOccupiedSeats += 1;
  return visibleOccupiedSeats;
}

function seesVisibleSeat(
  map: Position[][],
  y: number,
  x: number,
  yStep: number,
  xStep: number
): boolean {
  let currY = y + yStep;
  let currX = x + xStep;
  while (!isOutOfBounds(map, currY, currX)) {
    const currPosition = map[currY][currX];
    if (currPosition === '#') return true;
    if (currPosition === 'L') return false;
    currY += yStep;
    currX += xStep;
  }
  return false;
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

// function printMap(map: Position[][]): void {
//   let strMap = '';
//   for (let y = 0; y < map.length; y++) {
//     for (let x = 0; x < map[0].length; x++) {
//       strMap += map[y][x];
//     }
//     strMap += '\n';
//   }
//   console.log(strMap);
// }
