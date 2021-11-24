import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const inputData = readFileSync(inputFile, 'utf8').split('\n\n');

const matchRegex = /^"(?<matchVal>\w)"$/;
const rules = inputData[0].split('\n')
  .reduce((acc, curr) => {
    const [num, rawVal] = curr.split(': ');
    let val;
    if (matchRegex.test(rawVal)) {
      val = rawVal.match(matchRegex).groups.matchVal;
    } else {
      val = rawVal;
    }
    return { ...acc, [num]: val };
  }, {});

const messages = inputData[1].split('\n');

console.log(solve(rules, messages));

function solve(rules, messages) {
  let rulesRegex = getRulesRegex(rules, 0);
  return messages.filter(
    msg => rulesRegex.test(msg)
  ).length;
}

function getRulesRegex(rules, idx) {
  let currStr = rules[idx];
  let currNumStr = '';
  for (let i = 0; i < currStr.length; i++) {
    let currChar = currStr[i];
    let nextChar = currStr[i + 1];
    if (!isNaN(parseInt(currChar))) {
      currNumStr += currChar;
      if (isNaN(parseInt(nextChar))) {
        let insertStr = rules[currNumStr].indexOf(' ') > -1
          ? `(${rules[currNumStr]})`
          : rules[currNumStr];
        currStr = `${currStr.slice(0, i - (currNumStr.length - 1))}${insertStr}${currStr.slice(i + 1)}`;
        i -= currNumStr.length
        currNumStr = '';
      }
    }
  }
  currStr = currStr.replace(/\s/g, '');
  return new RegExp(`^${currStr}$`);
}