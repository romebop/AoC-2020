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
      if (isInfiniteLoop(editedInstructions, new Set<number>(), 0)) continue;
      return getAccumulator(editedInstructions, 0, 0);
    }
  }
  return -Infinity as never;
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

function isInfiniteLoop(
  instructions: Instruction[],
  history: Set<number>,
  index: number,
): boolean {
  if (history.has(index)) return true;
  if (index === instructions.length) return false;
  const { operation, argument } = instructions[index];
  if (operation === 'jmp') {
    return isInfiniteLoop(
      instructions,
      history.add(index),
      index + argument,
    );
  }
  return isInfiniteLoop(
    instructions,
    history.add(index),
    index + 1,
  );
}

function getAccumulator(
  instructions: Instruction[],
  accumulator: number,
  index: number,
): number {
  if (index === instructions.length) return accumulator;
  const { operation, argument } = instructions[index];
  switch (operation) {
    case 'acc':
      return getAccumulator(
        instructions,
        accumulator + argument,
        index + 1,
      );
    case 'jmp':
      return getAccumulator(
        instructions,
        accumulator,
        index + argument,
      );
    case 'nop':
      return getAccumulator(
        instructions,
        accumulator,
        index + 1,
      );
  }
  return -Infinity as never;
}
