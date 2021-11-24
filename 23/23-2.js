import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const inputCups = readFileSync(inputFile, 'utf8')
  .split('')
  .map(e => +e);

const maxVal = 1000000;
const numMoves = 10000000;

console.log(solve(inputCups, numMoves));

function solve(inputCups, numMoves) {
  const minVal = Math.min(...inputCups);
  const maxInputVal = Math.max(...inputCups);
  const nextCups = new Array(maxVal + 1);
  for (let i = minVal; i < nextCups.length; i++) {
    if (i <= maxInputVal) {
      if (i === maxInputVal) {
        nextCups[inputCups[i - 1]] = maxInputVal + 1;        
      } else {
        nextCups[inputCups[i - 1]] = inputCups[i];
      }
    } else if (i === nextCups.length - 1) {
      nextCups[i] = inputCups[0];
    } else {
      nextCups[i] = i + 1;
    }
  }
  let currCup = inputCups[0];
  for (let i = 0; i < numMoves; i++) {
    const pickCup1 = nextCups[currCup];
    const pickCup2 = nextCups[pickCup1];
    const pickCup3 = nextCups[pickCup2];
    nextCups[currCup] = nextCups[pickCup3];
    let destCup = null;
    let testCup = (currCup === minVal) ? maxVal : (currCup - 1);
    while (destCup === null) {
      if (testCup === pickCup1 || testCup === pickCup2 || testCup === pickCup3) {
        testCup = (testCup === minVal) ? maxVal : (testCup - 1); 
      } else {
        destCup = testCup;
      }
    }
    const temp = nextCups[destCup];
    nextCups[destCup] = pickCup1;
    nextCups[pickCup3] = temp;
    currCup = nextCups[currCup];
  }
  const oneNext = nextCups[1];
  const twoNext = nextCups[oneNext];
  return oneNext * twoNext;
}