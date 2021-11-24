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
  location: Location;
  wayPoint: Location;
}

interface Location {
  eastWest: number;
  northSouth: number;
}

const startState: ShipState = {
  location: {
    eastWest: 0,
    northSouth: 0,
  },
  wayPoint: {
    eastWest: 10,
    northSouth: 1,
  },
};

console.log(solve(instrs, startState));

function solve(instrs: Instruction[], startState: ShipState) {
  let currState: ShipState = cloneState(startState);
  for (const instr of instrs) {
    currState = applyInstruction(currState, instr);
  }
  return getManhattanDistance(startState, currState);
}

function applyInstruction(startState: ShipState, instr: Instruction): ShipState {
  const { action, value } = instr;
  if (['N', 'S', 'E', 'W'].includes(action)) return applyNSEW(startState, action as Direction, value);
  if (action === 'F') return applyF(startState, value);
  if (['L', 'R'].includes(action)) return applyLR(startState, action, value);
  return startState;
}

function applyNSEW(startState: ShipState, action: Direction, value: number): ShipState {
  const newState: ShipState = cloneState(startState);
  if (action === 'N') newState.wayPoint.northSouth += value;
  if (action === 'S') newState.wayPoint.northSouth -= value;
  if (action === 'E') newState.wayPoint.eastWest += value;
  if (action === 'W') newState.wayPoint.eastWest -= value;
  return newState;
}

function applyF(startState: ShipState, value: number): ShipState {
  const newState: ShipState = cloneState(startState);
  for (let i = value; i > 0; i--) {
    newState.location.northSouth += newState.wayPoint.northSouth;
    newState.location.eastWest += newState.wayPoint.eastWest;
  }
  return newState;
}

function applyLR(startState: ShipState, action: Action, value: number): ShipState {
  const newState: ShipState = cloneState(startState);
  let rotAngle = value;
  if (action === 'L') rotAngle *= -1;
  newState.wayPoint = getRotWayPoint(newState.wayPoint, rotAngle);
  return newState;
}

function getRotWayPoint({ eastWest, northSouth }: Location, angle: number): Location {
  return {
    eastWest: getRotX(eastWest, northSouth, angle),
    northSouth: getRotY(eastWest, northSouth, angle),
  };
}

function getRotX(x: number, y: number, angle: number): number {
  const rad = angle * (Math.PI / 180);
  const newX = y * Math.sin(rad) + x * Math.cos(rad);
  return Math.round(newX);
}

function getRotY(x: number, y: number, angle: number): number {
  const rad = angle * (Math.PI / 180);
  const newY = y * Math.cos(rad) - x * Math.sin(rad);
  return Math.round(newY);
}

function getManhattanDistance(state1: ShipState, state2: ShipState): number {
  return Math.abs(state2.location.eastWest - state1.location.eastWest)
    + Math.abs(state2.location.northSouth - state1.location.northSouth);
}

function cloneState(state: ShipState): ShipState {
  return JSON.parse(JSON.stringify(state));
}
