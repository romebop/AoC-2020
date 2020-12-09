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

console.log(solve(instructions, new Set<number>(), 0, 0));

function solve(
  instructions: Instruction[],
  history: Set<number>,
  accumulator: number,
  index: number,
): number {
  if (history.has(index)) return accumulator;
  const { operation, argument } = instructions[index];
  switch (operation) {
    case 'acc':
      return solve(
        instructions,
        history.add(index),
        accumulator + argument,
        index + 1,
      );
    case 'jmp':
      return solve(
        instructions,
        history.add(index),
        accumulator,
        index + argument,
      );
    case 'nop':
      return solve(
        instructions,
        history.add(index),
        accumulator,
        index + 1,
      );
  }
}
