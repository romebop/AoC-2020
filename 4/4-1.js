const fs = require('fs');

try {
  const passports = fs.readFileSync('4.input.txt', 'utf8')
    .split('\n')
    .reduce((acc, curr) => {
      if (curr === '') return [...acc, curr];
      acc[acc.length - 1] = `${acc[acc.length - 1]} ${curr}`;
      return acc;
    }, [''])
    .map(s => s.trim().split(' '))
    .map(a => a.reduce((acc, curr) => {
      const [key, val] = curr.split(':');
      return { ...acc, [key]: val };
    }, {}));

  console.log(solve(passports));
} catch (err) {
  console.error(err);
}

function solve(passports) {
  return passports.map(isValidPassport)
    .reduce((acc, curr) => acc + curr);
}

function isValidPassport(passport) {
  const reqFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
  for (const field of reqFields) {
    if (!passport.hasOwnProperty(field)) return false;
  }
  return true;
}
