import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const adapterRatings = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e)
  .sort((a, b) => a - b);

const outletRating = 0;
const deviceRating = adapterRatings[adapterRatings.length - 1] + 3;
const ratings = [outletRating, ...adapterRatings, deviceRating];

console.log(solve(ratings));

function solve(ratings) {
  const distribution = getDistribution(ratings);
  console.log(distribution);
  return distribution[1] * distribution[3];
}

function getDistribution(ratings) {
  return ratings.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return acc;
    const diff = curr - arr[idx - 1];
    return {
      ...acc,
      [diff]: (acc.hasOwnProperty(diff) ? acc[diff] : 0) + 1
    };
  }, {});
}
