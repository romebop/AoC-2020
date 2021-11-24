import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const inputData = readFileSync(inputFile, 'utf8').split('\n');

const earliestTime = +inputData[0];

const busIds = inputData[1].split(',')
  .filter(id => id !== 'x')
  .map(e => +e);

console.log(solve(earliestTime, busIds));

function solve(earliestTime, busIds) {
  if (!busIds.length) return null;
  const { id, waitTime } = busIds.map(id => ({
      id,
      waitTime: getWaitTime(earliestTime, id),
    }))
    .reduce((min, curr) =>
      curr.waitTime < min.waitTime ? curr : min
    );
  return id * waitTime;
}

function getWaitTime(time, loopTime) {
  return loopTime * Math.ceil(time / loopTime) - time;
}