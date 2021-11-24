import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const exprs = readFileSync(inputFile, 'utf8')
  .split('\n');

console.log(solve(exprs));

function solve(exprs) {
  return exprs.map(evalExpr)
    .reduce((a, c) => a + c, 0);
}

function evalExpr(expr) {
  if (expr.includes('(')) {
    return evalExpr(collapseParen(expr));
  }
  return evalNoParenExpr(expr);
}

function collapseParen(expr) {
  const startIdx = expr.indexOf('(');
  let parenCount = 1;
  let endIdx;
  for (let i = startIdx + 1; i < expr.length; i++) {
    if (expr[i] === '(') parenCount++;
    if (expr[i] === ')') {
      parenCount--;
      if (parenCount === 0) {
        endIdx = i;
        break;
      }
    }
  }
  return expr.slice(0, startIdx)
    + evalExpr(expr.slice(startIdx + 1, endIdx))
    + expr.slice(endIdx + 1);
}

function evalNoParenExpr(expr) {
  const symArr = expr.split(' ');
  let result = symArr[0];
  let currOp;
  for (let i = 1; i < symArr.length; i++) {
    const sym = symArr[i];
    if (isNaN(sym)) currOp = sym;
    else result = eval(`${result} ${currOp} ${sym}`);
  }
  return result;
}
