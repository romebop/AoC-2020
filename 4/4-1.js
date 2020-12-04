const fs = require('fs');

const inputFile = process.argv.slice(2)[0];

try {
  const passports = fs.readFileSync(inputFile, 'utf8')
    .split('\n\n')
    .map(s => s.replace(/\n/g, ' ').split(' '))
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
