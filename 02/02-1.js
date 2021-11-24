const fs = require('fs');

const inputFile = process.argv.slice(2)[0];

const entries = fs.readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(entry => {
    const [policyInput, password] = entry.split(': ');
    const [minMaxInput, letter] = policyInput.split(' ');
    const [min, max] = minMaxInput.split('-');
    return {
      policy: { letter, min, max },
      password,
    };
  });

console.log(solve(entries));

function solve(entries) {
  return entries.map(isValidPassword)
    .reduce((acc, curr) => curr ? acc + 1 : acc, 0);
}

function letterCount(text, letter) {
  return text.split('')
    .reduce((acc, curr) => curr === letter ? acc + 1 : acc, 0);
}

function isValidPassword({ password, policy }) {
  const { letter, min, max } = policy;
  const count = letterCount(password, letter);
  return count >= min && count <= max;
}
