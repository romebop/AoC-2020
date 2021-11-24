import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type Operation = 'acc' | 'jmp' | 'nop';

interface Instruction {
  operation: Operation;
  argument: number;
}

const instructions: Instruction[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(s => s.split(' '))
  .map(([op, arg]) => ({
    operation: (op as Operation),
    argument: +arg
  }));

console.log(solve(instructions));

function solve(instructions: Instruction[]): number {
  let accumulator = 0;
  let index = 0;
  const history = new Set();
  while (index < instructions.length) {
    if (history.has(index)) return accumulator;
    history.add(index);
    const { operation, argument } = instructions[index];
    switch (operation) {
      case 'acc':
        accumulator += argument;
        index++;
        break;
      case 'jmp':
        index += argument;
        break;
      case 'nop':
        index++;
        break;
    }
  }
  return accumulator;
}
