import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const inputData = readFileSync(inputFile, 'utf8').split('\n');

const buses = inputData[1].split(',')
  .map((id, index) => ({ id, index }))
  .filter(bus => bus.id !== 'x')
  .map(({ id, index }) => ({ id: +id, index }));

console.log(solve(buses));

// chinese remainder theorem
// congruences: t + index = 0 (mod id)
function solve(buses) {
  let t = 0;
  let increment = 1;
  for (const { id, index } of buses) {
    while ((t + index) % id !== 0) {
      t += increment;
    }
    increment = getLcm(increment, id); 
    // increment *= id // if coprime
  }
  return t;
}

function getGcd(a, b) {
  if (!b) return a;
  return getGcd(b, a % b);
}

function getLcm(a, b) {
  return (a * b) / getGcd(a, b);
}
