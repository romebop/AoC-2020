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
  function playGame(deck1, deck2) {
    gameNum++;
    const currGameNum = gameNum;
    console.log(`=== Game ${currGameNum} ===`);
    const prevStates = new Set();
    let roundNum = 0;
    while (deck1.length > 0 && deck2.length > 0) {
      if (prevStates.has(serializeDecks(deck1, deck2))) {
        return { winner: '1', winningDeck: deck1 };
      }
      prevStates.add(serializeDecks(deck1, deck2));
      roundNum++;
      console.log(`\n-- Round ${roundNum} (Game ${currGameNum}) --`);
      console.log(`Player 1's deck: ${deck1.join(', ')}`);
      console.log(`Player 2's deck: ${deck2.join(', ')}`);
      const card1 = deck1.shift();
      const card2 = deck2.shift();
      console.log(`Player 1 plays: ${card1}`);
      console.log(`Player 2 plays: ${card2}`);
  
      let winner;
      if (deck1.length >= card1 && deck2.length >= card2) {
        console.log('Playing a sub-game to determine the winner...\n');
        winner = playGame(deck1.slice(0, card1), deck2.slice(0, card2)).winner;
        console.log(`...anyway, back to game ${currGameNum}.`);
      } else {
        winner = (card1 > card2) ? '1' : '2';
      }
      if (winner === '1') {
        deck1.push(card1, card2);
      } else {
        deck2.push(card2, card1);
      }
      console.log(`Player ${winner} wins round ${roundNum} of game ${currGameNum}!`);
    }
    let winner;
    let winningDeck;
    if (deck1.length > 0) {
      winner = '1';
      winningDeck = deck1; 
    } else {
      winner = '2';
      winningDeck = deck2;
    }
    console.log(`The winner of game ${currGameNum} is player ${winner}!\n`);
    return { winner, winningDeck };
  }
  let gameNum = 0;
  const { winner, winningDeck } = playGame(deck1, deck2);
  console.log('\n== Post-game results ==');
  console.log(`Player 1's deck: ${winner === '1' ? winningDeck.join(', ') : ''}`);
  console.log(`Player 2's deck: ${winner === '2' ? winningDeck.join(', ') : ''}\n`);  
  return getScore(winningDeck); 
}

function getScore(deck) {
  return deck.reduce((acc, curr, i, arr) => {
    return acc + (curr * (arr.length - i));
  }, 0); 
}

function serializeDecks(deck1, deck2) {
  return JSON.stringify(deck1) + JSON.stringify(deck2);
}