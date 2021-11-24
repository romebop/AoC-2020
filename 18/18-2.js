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
  if (expr.includes('+')) {
    return evalNoParenExpr(collapseAdd(expr));
  }
  return expr.split(' ')
    .filter(sym => sym !== '*')
    .reduce((a, c,) => a * +c, 1);
}

function collapseAdd(expr) {
  const symArr = expr.split(' ');
  for (let i = 0; i < symArr.length; i++) {
    if (symArr[i] === '+') {
      symArr.splice(i - 1, 3, +symArr[i - 1] + +symArr[i + 1]);
      break;
    }
  }
  return symArr.join(' ');
}
