const fs = require('fs');

try {
  const entries = fs.readFileSync('2.input.txt', 'utf8')
    .split('\r\n')
    .map(entry => {
      const [ policyInput, password ] = entry.split(': ');
      const [ posInput, letter ] = policyInput.split(' ');
      const [ pos1, pos2 ] = posInput.split('-');
      return {
        policy: {
          letter,
          idx1: pos1 - 1,
          idx2: pos2 - 1,
        },
        password,
      };
    });
  console.log(
    solve(entries)
  );
} catch (err) {
  console.error(err)
}

function solve(entries) {
  return entries.map(isValidPassword)
    .reduce((acc, curr) => curr ? acc + 1 : acc, 0);
}

function isValidPassword({ password, policy }) {
  const { letter, idx1, idx2 } = policy;
  return password[idx1] === letter && password[idx2] !== letter
    || password[idx1] !== letter && password[idx2] === letter;
}