import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const instrs: Instruction[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(s => ({
    action: s[0] as Action,
    value: +s.slice(1)
  }));

type Direction = 'N' | 'S' | 'E' | 'W';

type Action = Direction | 'L' | 'R' | 'F';

interface Instruction {
  action: Action;
  value: number;
}

interface ShipState {
  northSouth: number;
  eastWest: number;
  face: Direction;
}

const startState: ShipState = {
  northSouth: 0,
  eastWest: 0,
  face: 'E',
};

console.log(solve(instrs, startState));

function solve(instrs: Instruction[], startState: ShipState) {
  let currState: ShipState = { ...startState };
  for (const instr of instrs) {
    currState = applyInstruction(currState, instr);
  }
  return getManhattanDistance(startState, currState);
}

function applyInstruction(startState: ShipState, instr: Instruction): ShipState {
  const { action, value } = instr;
  if (['N', 'S', 'E', 'W'].includes(action)) return applyNSEWF(startState, action as Direction, value);
  if (['L', 'R'].includes(action)) return applyLR(startState, action, value);
  if (action === 'F') return applyNSEWF(startState, null, value);
  return startState;
}

function applyNSEWF(startState: ShipState, action: Direction | null, value: number): ShipState {
  const newState: ShipState = { ...startState };
  const dir = action || newState.face;
  if (dir === 'N') newState.northSouth += value;
  if (dir === 'S') newState.northSouth -= value;
  if (dir === 'E') newState.eastWest += value;
  if (dir === 'W') newState.eastWest -= value;
  return newState;
}

function applyLR(startState: ShipState, action: Action, value: number): ShipState {
  const newState: ShipState = { ...startState };
  const dirs: Direction[] = ['N', 'E', 'S', 'W'];
  const startIdx = dirs.indexOf(startState.face);
  let idxOffset = value / 90;
  if (action === 'L') idxOffset *= -1;
  let newIdx = (startIdx + idxOffset) % dirs.length;
  if (newIdx < 0) newIdx += dirs.length;
  newState.face = dirs[newIdx];
  return newState;
}

function getManhattanDistance(state1: ShipState, state2: ShipState): number {
  return Math.abs(state2.northSouth - state1.northSouth)
    + Math.abs(state2.eastWest - state1.eastWest);
}
