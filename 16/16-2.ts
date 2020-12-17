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

interface MergeElement {
  passingRules: string[];
  value: number;
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

const myTicket: number[] = splitInput[1][1]
  .split(',')
  .map(e => +e);

const nearbyTickets: number[][] = splitInput[2].slice(1)
  .map(s => s.split(','))
  .map(a => a.map(e => +e));

console.log(solve(rules, myTicket, nearbyTickets));

function solve(rules: Rule[], myTicket: number[], nearbyTickets: number[][]): number {
  const validTickets = nearbyTickets.filter(isValidTicket(rules));
  const allPassingRules = getAllPassingRules(rules, validTickets);
  const merged = getMerged(allPassingRules, myTicket);
  merged.sort((a, b) => a.passingRules.length - b.passingRules.length);

  for (let i = 0; i < merged.length; i++) {
    const targetRule = merged[i].passingRules[0];
    for (let j = i + 1; j < merged.length; j++) {
      const ruleIdx = merged[j].passingRules.indexOf(targetRule);
      if (ruleIdx > -1) merged[j].passingRules.splice(ruleIdx, 1);
    }
  }

  return merged.reduce((acc: number, curr: MergeElement) => {
    return curr.passingRules[0].includes('departure')
      ? acc * curr.value
      : acc;
  }, 1);
}

function getMerged(allPassingRules: string[][], ticket: number[]): MergeElement[] {
  const result = [];
  for (let i = 0; i < allPassingRules.length; i++) {
    result.push({
      passingRules: allPassingRules[i],
      value: ticket[i],
    });
  }
  return result;
}

function getAllPassingRules(rules: Rule[], tickets: number[][]): string[][] {
  return rotateArray(tickets).reduce((validRules: string[][], column: number[]) => {
    return [...validRules, getColumnPassingRules(rules, column)];
  }, []);
}

function getColumnPassingRules(rules: Rule[], column: number[]): string[] {
  const passingRules = [];
  for (const rule of rules) {
    if (column.every(passesRule(rule))) passingRules.push(rule.name);
  }
  return passingRules;
}

function passesRule(rule: Rule) {
  return (value: number): boolean => {
    for (const range of rule.ranges) {
      if (value >= range.min && value <= range.max) return true;
    }
    return false;
  };
}

function rotateArray(array: any[][]): any[][] {
  const result = [];
  for (let col = 0; col < array[0].length; col++) {
    result.push([]);
    for (let row = 0; row < array.length; row++) {
      (result[col] as any[]).push(array[row][col]);
    }
  }
  return result;
}

function isValidTicket(rules: Rule[]) {
  return (ticket: number[]): boolean =>
    ticket.reduce((isValid: boolean, value: number) => {
      return isValid && passesAnyRule(rules, value);
    }, true);
}

function passesAnyRule(rules: Rule[], value: number): boolean {
  for (const rule of rules) {
    if (passesRule(rule)(value)) return true;
  }
  return false;
}
