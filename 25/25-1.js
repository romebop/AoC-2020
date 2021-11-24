import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const publicKeys = readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(e => +e);

console.log(solve(publicKeys));

function getLoopSize(publicKey) {
  const subNum = 7;
  let val = 1;
  let loopSize = 0;
  while (val !== publicKey) {
    val = transform(val, subNum);
    loopSize++;
  }
  return loopSize;
}

function getEncryptionKey(publicKey, loopSize) {
  let val = 1;
  for (let i = 0; i < loopSize; i++) {
    val = transform(val, publicKey);
  }
  return val;
}

function transform(val, subNum) {
  return (val * subNum) % 20201227;
}

function solve(publicKeys) {
  return getEncryptionKey(
    publicKeys[0],
    getLoopSize(publicKeys[1]),
  );
}
