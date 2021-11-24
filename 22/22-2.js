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
  const { winningDeck } = playGame(deck1, deck2);
  return getScore(winningDeck); 
}

function playGame(deck1, deck2) {
  const prevStates = new Set();
  while (deck1.length > 0 && deck2.length > 0) {
    if (prevStates.has(serializeDecks(deck1, deck2))) {
      return { winner: '1', winningDeck: deck1 };
    }
    prevStates.add(serializeDecks(deck1, deck2));
    const card1 = deck1.shift();
    const card2 = deck2.shift();
    let winner;
    if (deck1.length >= card1 && deck2.length >= card2) {
      winner = playGame(
        deck1.slice(0, card1),
        deck2.slice(0, card2),
      ).winner;
    } else {
      winner = (card1 > card2) ? '1' : '2';
    }
    if (winner === '1') {
      deck1.push(card1, card2);
    } else {
      deck2.push(card2, card1);
    }
  }
  return (deck1.length > 0)
    ? { winner: '1', winningDeck: deck1 }
    : { winner: '2', winningDeck: deck2 };
}

function getScore(deck) {
  return deck.reduce((acc, curr, i, arr) => (
    acc + (curr * (arr.length - i))
  ), 0); 
}

function serializeDecks(deck1, deck2) {
  return JSON.stringify(deck1) + JSON.stringify(deck2);
}