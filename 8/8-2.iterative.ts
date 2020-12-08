import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

type Operation = 'acc' | 'jmp' | 'nop';

interface Instruction {
  operation: Operation;
  argument: number;
}

interface EditMap {
  [op: string]: Operation
}

const instructions: Instruction[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(s => s.split(' '))
  .map(([op, arg]) => ({
    operation: op as Operation,
    argument: +arg
  }));

const editMap: EditMap = {
  jmp: 'nop',
  nop: 'jmp',
};

console.log(solve(instructions, editMap));

function solve(instructions: Instruction[], editMap: EditMap): number {
  for (let i = 0; i < instructions.length; i++) {
    const { operation } = instructions[i];
    if (Object.keys(editMap).includes(operation)) {
      const editedInstructions = editOperation(instructions, i, editMap[operation]);
      if (isInfiniteLoop(editedInstructions)) continue;
      return getAccumulator(editedInstructions);
    }
  }
  return -Infinity as never;
}

function isInfiniteLoop(instructions: Instruction[]): boolean {
  let index = 0;
  const history = new Set();
  while (index < instructions.length) {
    if (history.has(index)) return true;
    history.add(index);
    const { operation, argument } = instructions[index];
    switch (operation) {
      case 'acc':
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
  return false;
}

function editOperation(
  instructions: Instruction[],
  index: number,
  operation: Operation,
): Instruction[] {
  return [
    ...instructions.slice(0, index),
    {
      operation,
      argument: instructions[index].argument,
    },
    ...instructions.slice(index + 1),
  ];
}

function getAccumulator(instructions: Instruction[]): number {
  let accumulator = 0;
  let index = 0;
  while (index < instructions.length) {
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
