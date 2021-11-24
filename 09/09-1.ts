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
  for (let i = 0; i < preamble.length; i++) {
    for (let j = i + 1; j < preamble.length; j++) {
      if (target === preamble[i] + preamble[j]) return true;
    }
  }
  return false;
}
