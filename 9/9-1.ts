import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const data: number[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e);

const preambleLen = 25;

console.log(getInvalidNum(data, preambleLen));

function getInvalidNum(data: number[], preambleLen: number) {
  for (let i = preambleLen; i < data.length; i++) {
    const preamble = data.slice(i - preambleLen, i);
    if (!doesPass(data[i], preamble)) return data[i];
  }
}

function doesPass(target: number, preamble: number[]): boolean {
  for (let j = 0; j < preamble.length; j++) {
    for (let k = j + 1; k < preamble.length; k++) {
      if (target === preamble[j] + preamble[k]) return true;
    }
  }
  return false;
}
