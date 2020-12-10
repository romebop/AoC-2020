import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

interface Distribution {
  [diff: number]: number;
}

const adapterRatings: number[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e)
  .sort((a, b) => a - b);

const outletRating = 0;
const deviceRating = adapterRatings[adapterRatings.length - 1] + 3;
const ratings: number[] = [outletRating, ...adapterRatings, deviceRating];

console.log(solve(ratings));

function solve(ratings: number[]): number {
  const distribution = getDistribution(ratings);
  return distribution[1] * distribution[3];
}

function getDistribution(ratings: number[]): Distribution {
  return ratings.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return acc;
    const diff = curr - arr[idx - 1];
    return {
      ...acc,
      [diff]: (acc.hasOwnProperty(diff) ? acc[diff] : 0) + 1
    };
  }, {} as Distribution);
}
