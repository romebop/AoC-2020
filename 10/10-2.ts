import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const adapterRatings: number[] = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e)
  .sort((a, b) => a - b);

const outletRating = 0;
const deviceRating = adapterRatings[adapterRatings.length - 1] + 3;
const ratings: number[] = [outletRating, ...adapterRatings, deviceRating];

console.log(solve(ratings, outletRating));

function solve(ratings: number[], jolt: number): number {
  if (jolt === deviceRating) return 1;
  if (!ratings.includes(jolt) || jolt > deviceRating) return 0;
  return solve(ratings, jolt + 1) + solve(ratings, jolt + 2) + solve(ratings, jolt + 3);
}
