import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const cups = readFileSync(inputFile, 'utf8')
  .split('')
  .map(e => +e);

const numMoves = 10000000;

console.log(solve(cups, numMoves));

function solve(cups, numMoves) {
  let currCups = cups;
  for (let c = 10; c <= 1000000; c++) {
    currCups.push(c);
  }
  for (let i = 0; i < numMoves; i++) {
    console.log('doing move:', i + 1);
    const leftOvers = [currCups[0], ...currCups.slice(4)];
    const pickUps = currCups.slice(1, 4);
    let destCup = null;
    let testCup = currCups[0] > 1
      ? currCups[0] - 1
      : 1000000;
    while (destCup === null) {
      if (leftOvers.includes(testCup)) {
        destCup = testCup;
      } else {
        testCup--;
        if (testCup < 1) {
          testCup = 1000000;
        }
      }
    }
    const destCupIdx = leftOvers.indexOf(destCup);
    leftOvers.splice(destCupIdx + 1, 0, ...pickUps);
    currCups = leftOvers;
    const prevCurrCup = currCups.shift();
    currCups.push(prevCurrCup);
  }
  const oneIdx = currCups.indexOf(1);
  const oneNext = currCups[(oneIdx + 1) % currCups.length]
  const twoNext = currCups[(oneIdx + 2) % currCups.length]
  return oneNext * twoNext;
}