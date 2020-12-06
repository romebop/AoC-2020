import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const data: Set<string>[][] = readFileSync(inputFile, 'utf8')
  .split('\n\n')
  .map(str => str.split('\n'))
  .map(arr => arr.map(str => new Set(str.split(''))));

console.log(solve(data));

function solve(data: Set<string>[][]): number {
  return data.map((group: Set<string>[]): Set<string> =>
      group.reduce((acc, curr) => new Set([...acc, ...curr]))
    )
    .map(set => set.size)
    .reduce((acc, curr) => acc + curr);
}
