import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const writeRegex = /^mem\[(?<addr>\d+)\] = (?<val>\d+)$/;

const initProg = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(line => {
    if (writeRegex.test(line)) {
      const groups = line.match(writeRegex).groups;
      return {
        type: 'write',
        addr: +groups.addr,
        val: +groups.val,
      };
    }
    return {
      type: 'mask',
      val: line.split(' ')[2],
    };
  });

const bits = 36;

console.log(solve(initProg));

function solve(initProg) {
  const mem = {};
  let mask;
  for (const instr of initProg) {
    if (instr.type === 'write') {
      const { addr, val } = instr;
      const valBits = val.toString(2).padStart(bits, '0');
      const maskedStr = getMaskedStr(mask, valBits);
      mem[addr] = parseInt(maskedStr, 2);
    } else {
      mask = instr.val;
    }
  }
  return sumMemVals(mem);
}

function getMaskedStr(mask, valBits) {
  let result = '';
  for (let i = 0; i < bits; i++) {
    if (mask[i] === 'X') result += valBits[i];
    else result += mask[i];
  }
  return result;
}

function sumMemVals(mem) {
  return Object.values(mem)
    .reduce((a, c) => a + c, 0);
}
