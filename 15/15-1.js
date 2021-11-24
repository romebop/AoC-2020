import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const startNums = readFileSync(inputFile, 'utf8')
  .split(',')
  .map(s => +s);

const targetTurn = 2020;

console.log(solve(startNums, targetTurn));

function solve(startNums, targetTurn) {
  const turnRec = {};
  let turn = 0;
  let lastNum;

  for (const num of startNums) {
    turn++;
    if (turn > 1) turnRec[lastNum] = turn - 1;
    lastNum = num;
  }

  while (true) {
    turn++;
    const num = turnRec.hasOwnProperty(lastNum)
      ? turn - 1 - turnRec[lastNum]
      : 0;
    if (turn === targetTurn) return num;
    turnRec[lastNum] = turn - 1;
    lastNum = num;
  }
}
