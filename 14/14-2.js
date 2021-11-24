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
      const addrBits = addr.toString(2).padStart(bits, '0');
      const maskedStr = getMaskedStr(mask, addrBits);
      writeMem(mem, maskedStr, val);
    } else {
      mask = instr.val;
    }
  }
  return sumMemVals(mem);
}

function getMaskedStr(mask, addrBits) {
  let result = '';
  for (let i = 0; i < bits; i++) {
    if (mask[i] === '0') result += addrBits[i];
    else result += mask[i];
  }
  return result;
}

function writeMem(mem, maskedStr, val) {
  if (!maskedStr.includes('X')) {
    const addr = parseInt(maskedStr, 2);
    mem[addr] = val;
    return;
  }
  for (let i = 0; i < bits; i++) {
    if (maskedStr[i] === 'X') {
      writeMem(mem, replaceChar(maskedStr, i, '0'), val);
      writeMem(mem, replaceChar(maskedStr, i, '1'), val);
      return;
    }
  }
}

function replaceChar(str, i, char) {
  return str.slice(0, i) + char + str.slice(i + 1);
}

function sumMemVals(mem) {
  return Object.values(mem)
    .reduce((a, c) => a + c, 0);
}
