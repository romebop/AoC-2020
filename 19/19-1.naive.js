import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const inputData = readFileSync(inputFile, 'utf8').split('\n\n');

const matchRegex = /^"(?<matchVal>\w)"$/;
const rules = inputData[0].split('\n')
  .reduce((acc, curr) => {
    const [num, val] = curr.split(': ');
    let prop;
    if (matchRegex.test(val)) {
      prop = {
        type: 'match',
        val: val.match(matchRegex).groups.matchVal,
      };
    } else {
      prop = {
        type: 'sublist',
        val: val.split(' | ').map(s => s.split(' ').map(e => +e)),
      };
    }
    return { ...acc, [num]: prop };
  }, {});

const messages = inputData[1].split('\n');

console.log(solve(rules, messages));

function solve(rules, messages) {
  const validMsgs = getValidMsgs(rules, 0);
  return messages.filter(m => validMsgs.includes(m)).length;
}

function getValidMsgs(rules, num) {
  const x = rules[num].val;
  while (hasNum(x)) {
    for (let y = 0; y < x.length; y++) {
      for (let z = 0; z < x[y].length; z++) {
        if (!isNaN(x[y][z])) {
          const rule = rules[x[y][z]];
          x[y].splice(z, 1, rule.val);
        }
      }
    }
    for (let y = 0; y < x.length; y++) {
      for (let z = 0; z < x[y].length; z++) {
        if (Array.isArray(x[y][z])) {
          const flatPaths = x[y][z].map(
            path => [...x[y].slice(0, z), ...path, ...x[y].slice(z + 1)]
          );
          x.splice(y, 1, ...flatPaths);
          y += flatPaths.length - 1;
        }
      }
    }
  }
  return x.map(a => a.join(''));
}

function hasNum(x) {
  return x.some(a => a.some(e => !isNaN(e)));
}
