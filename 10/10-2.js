import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const adapterRatings = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e)
  .sort((a, b) => a - b);

const joltDiff = 3;
const outletRating = 0;
const deviceRating = adapterRatings[adapterRatings.length - 1] + joltDiff;
const ratings = [...adapterRatings, deviceRating];

console.log(solve(ratings));

function solve(ratings) {
  const nMap = new Map([[outletRating, 1]]);
  for (const rating of ratings) {
    let n = 0;
    for (let i = 1; i <= joltDiff; i++) {
      n += nMap.has(rating - i) ? nMap.get(rating - i) : 0;
    }
    nMap.set(rating, n);
  }
  return nMap.get(deviceRating);
}