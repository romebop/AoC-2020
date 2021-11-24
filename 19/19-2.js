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
  const regex42 = getRulesRegex(rules, 42);
  const regex42Str = `(${regex42.source.slice(1, -1)})`;
  const regex31 = getRulesRegex(rules, 31);
  const regex31Str = `(${regex31.source.slice(1, -1)})`;
  return messages.filter(msg => {
    const count42 = getMatchCount(msg, regex42Str); // upper bound
    for (let num42 = 1; num42 <= count42; num42++) {
      for (let num31 = 1; num31 < num42; num31++) {
        const testRegex = new RegExp(
          `^${regex42Str.repeat(num42)}${regex31Str.repeat(num31)}$`
        );
        if (testRegex.test(msg)) return true;
      }
    }
    return false;
  }).length;
}

function getMatchCount(msg, regexStr) {
  return (msg.match(new RegExp(regexStr, 'g')) || []).length;
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
        i -= currNumStr.length;
        currNumStr = '';
      }
    }
  }
  currStr = currStr.replace(/\s/g, '');
  return new RegExp(`^${currStr}$`);
}