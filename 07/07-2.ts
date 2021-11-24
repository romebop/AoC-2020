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

console.log(numBags(rules, targetBag));

function numBags(rules: Rules, targetBag: string): number {
  return Object.keys(rules[targetBag])
    .reduce((acc, currBag) => {
      return acc + (rules[targetBag][currBag] * (1 + numBags(rules, currBag)));
    }, 0);
}
