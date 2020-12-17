import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const splitInput = readFileSync(inputFile, 'utf8')
  .split('\n\n')
  .map(s => s.split('\n'));

interface Rule {
  name: string;
  ranges: Range[];
}

interface Range {
  min: number;
  max: number;
}

const rules: Rule[] = splitInput[0].reduce((acc: Rule[], rule: string) => {
  const [name, ranges] = rule.split(': ');
  return [
    ...acc,
    {
      name,
      ranges: ranges.split(' or ').reduce((acc: Range[], range: string) => {
        const [min, max] = range.split('-');
        return [
          ...acc,
          {
            min: +min,
            max: +max
          }
        ];
      }, []),
    },
  ];
}, []);

// const myTicket: number[] = splitInput[1][1]
//   .split(',')
//   .map(e => +e);

const nearbyTickets: number[][] = splitInput[2].slice(1)
  .map(s => s.split(','))
  .map(a => a.map(e => +e));

console.log(solve(rules, nearbyTickets));

function solve(rules: Rule[], nearbyTickets: number[][]) {
  const invalidValues = [];
  for (const ticket of nearbyTickets) {
    for (const value of ticket) {
      if (!isInRange(rules, value)) invalidValues.push(value);
    }
  }
  return invalidValues.reduce((sum, value) => sum + value, 0);
}

function isInRange(rules: Rule[], value: number): boolean {
  for (const rule of rules) {
    for (const range of rule.ranges) {
      if (value >= range.min && value <= range.max) return true;
    }
  }
  return false;
}
