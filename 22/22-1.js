import { readFileSync } from 'fs';

const inputFile = process.argv.slice(2)[0];

const [deck1, deck2] = readFileSync(inputFile, 'utf8')
  .split('\n\n')
  .map(d => d.split('\n')
    .slice(1)
    .map(e => +e)
  );

console.log(solve(deck1, deck2));

function solve(deck1, deck2) {
  while (deck1.length > 0 && deck2.length > 0) {
    const card1 = deck1.shift();
    const card2 = deck2.shift();
    if (card1 > card2) {
      deck1.push(card1, card2);
    } else {
      deck2.push(card2, card1);
    }
  }
  const winningDeck = (deck1.length > 0) ? deck1 : deck2;
  return winningDeck.reduce((acc, curr, i, arr) => (
    acc + (curr * (arr.length - i))
  ), 0); 
}