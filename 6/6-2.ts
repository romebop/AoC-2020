import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const data: string[][][] = readFileSync(inputFile, 'utf8')
  .split('\n\n')
  .map(str => str.split('\n'))
  .map(arr => arr.map(str => str.split('')));

console.log(solve(data));

function solve(data: string[][][]): number {
  return data.map((group: string[][]): string[] =>
      group.reduce((acc, curr) => acc.filter(q => curr.includes(q)))
    )
    .map(a => a.length)
    .reduce((acc, curr) => acc + curr);
}
