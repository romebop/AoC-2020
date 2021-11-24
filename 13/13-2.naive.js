import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const inputData = readFileSync(inputFile, 'utf8').split('\n');

const buses = inputData[1].split(',')
  .map((id, index) => ({ id, index }))
  .filter(bus => bus.id !== 'x')
  .map(({ id, index }) => ({ id: +id, index }));

console.log(solve(buses));

function solve(buses) {
  const maxBus = buses.reduce((max, curr) => curr.id > max.id ? curr : max);
  let t = -maxBus.index;
  let isValid = false;
  while (!isValid) {
    t += maxBus.id;
    let accValid = true;
    for (const bus of buses) {
      if ((t + bus.index) % bus.id !== 0) {
        accValid = false;
        break;
      }
    }
    isValid = accValid;
  }
  return t;
}
