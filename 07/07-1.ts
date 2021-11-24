import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

interface Rules {
  [bag: string]: {
    [containedBag: string]: number
  }
}

const rules: Rules = readFileSync(inputFile, 'utf8')
  .split('\n')
  .reduce((accRules, currStr) => {
    const [bag, containStr] = currStr.split(' bags contain ');
    const containObj = containStr === 'no other bags.'
      ? {}
      : containStr.split(', ')
          .reduce((acc, curr) => {
            const words = curr.split(' ');
            return { ...acc, [`${words[1]} ${words[2]}`]: +words[0] };
          }, {});
    return { ...accRules, [bag]: containObj };
  }, {});

const targetBag = 'shiny gold';

console.log(solve(rules, targetBag));

function solve(rules: Rules, targetBag: string): number {
  return Object.keys(rules)
    .map(bag => doesContain(rules, bag, targetBag))
    .reduce((acc, curr) => curr ? acc + 1 : acc, 0);
}

function doesContain(rules: Rules, bag: string, targetBag: string): boolean {
  if (rules[bag][targetBag]) return true;
  for (const containedBag of Object.keys(rules[bag])) {
    if (doesContain(rules, containedBag, targetBag)) return true;
  }
  return false;
}
