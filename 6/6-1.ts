import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const data: string[][][] = readFileSync(inputFile, 'utf8')
  .split('\n\n')
  .map(str => str.split('\n'))
  .map(arr => arr.map(str => str.split('')));

console.log(solve(data));

function solve(data: string[][][]) {
  return data.map((group: string[][]): Set<string> =>
      new Set(group.reduce((acc, curr) => [...acc, ...curr]))
    )
    .map(set => set.size)
    .reduce((acc, curr) => acc + curr);
}
