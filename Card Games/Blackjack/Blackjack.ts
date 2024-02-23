import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { createBlackjackDeck, Card, dealInitialCards } from '../Deck/Deck';
import { Person, createPerson } from '../../Player/Player';

const rl = createInterface({ input, output });

function showHand(person: Person): void {
  console.log(`${person.name}'s hand: ${person.hand.map(card => `${card.value} of ${card.suit}`).join(', ')}`);
}

async function calculateHandValue(hand: Card[]): Promise<number> {
  let total = 0;
  let aceCount = hand.filter(card => card.value === 14).length;

  hand.forEach(card => {
    if (card.value >= 11 && card.value <= 13) total += 10;
    else if (card.value === 14) total += 11;
    else total += card.value;
  });

  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }

  return total;
}

async function checkForBlackjack(hand: Card[]): Promise<boolean> {
  const value = await calculateHandValue(hand);
  return hand.length === 2 && value === 21;
}

async function playerTurn(deck: Card[], player: Person, bet: number): Promise<boolean> {
  let playerTotal = await calculateHandValue(player.hand);
  let doubledDown = false;

  if (await checkForBlackjack(player.hand)) {
    console.log("Blackjack! You win 1.5x your bet.");
    player.balance += bet * 1.5;
    return false; // Ends player turn immediately
  }

  while (playerTotal < 21) {
    console.log(`Your total is ${playerTotal}.`);
    const hitOrStand = await rl.question('Do you want to (h)it, (s)tand, or (d)ouble down? ');

    if (hitOrStand.toLowerCase() === 'd' && !doubledDown && player.hand.length === 2) {
      player.balance -= bet; // Additional bet for doubling down
      bet *= 2; // Double the bet
      player.hand.push(deck.pop()!);
      console.log(`You doubled down and drew ${player.hand.at(-1)!.value} of ${player.hand.at(-1)!.suit}.`);
      doubledDown = true;
      break; // Player can only receive one card after doubling down
    } else if (hitOrStand.toLowerCase() === 'h') {
      player.hand.push(deck.pop()!);
      console.log(`You drew ${player.hand.at(-1)!.value} of ${player.hand.at(-1)!.suit}.`);
      playerTotal = await calculateHandValue(player.hand);
    } else {
      break;
    }
  }

  await showHand(player);
  if (playerTotal > 21) {
    console.log('Bust! You lose.');
    player.balance -= bet; // Adjust for double down if happened
    return false; // Player busts
  }
  return true; // Player stands
}

async function dealerTurn(deck: Card[], dealer: Person): Promise<number> {
  let dealerTotal = await calculateHandValue(dealer.hand);

  if (await checkForBlackjack(dealer.hand)) {
    console.log("Dealer has Blackjack!");
    return 21; // Indicates dealer has Blackjack
  }

  while (dealerTotal < 17) {
    dealer.hand.push(deck.pop()!);
    dealerTotal = await calculateHandValue(dealer.hand);
  }
  await showHand(dealer);
  return dealerTotal;
}

async function getBet(player: Person): Promise<number> {
  let bet = 0;
  do {
    const betString = await rl.question(`You have $${player.balance}. How much would you like to bet? `);
    bet = parseInt(betString, 10);
    if (isNaN(bet) || bet <= 0 || bet > player.balance) {
      console.log("Invalid bet amount. Please enter a valid number within your balance.");
      bet = 0;
    }
  } while (bet <= 0 || bet > player.balance);

  return bet;
}

export async function startGame(Player: Person) {
  try {
    let playAgain = 'y';

    while (playAgain.toLowerCase() === 'y') {
      Player.hand = [];
      const deck = createBlackjackDeck();
      const dealer: Person = { name: 'Dealer', password: '', balance: 0, hand: [] };

      const bet = await getBet(Player);

      await dealInitialCards(deck, Player);
      await dealInitialCards(deck, dealer);

      console.log('Welcome to Blackjack!');
      await showHand(Player);

      const playerBusts = !(await playerTurn(deck, Player, bet));
      if (playerBusts) {
        console.log(`You lost $${bet}. Your new balance is $${Player.balance}.`);
      } else {
        const dealerTotal = await dealerTurn(deck, dealer);
        const playerTotal = await calculateHandValue(Player.hand);

        if (dealerTotal > 21 || playerTotal > dealerTotal) {
          console.log('You win!');
          Player.balance += bet;
          console.log(`You won $${bet}. Your new balance is $${Player.balance}.`);
        } else if (playerTotal < dealerTotal) {
          console.log('Dealer wins.');
          Player.balance -= bet;
          console.log(`You lost $${bet}. Your new balance is $${Player.balance}.`);
        } else {
          console.log('Push. It\'s a tie.');
        }
      }

      if (Player.balance <= 0) {
        console.log("You've run out of funds! Game over.");
        break;
      }

      playAgain = await rl.question("Would you like to play again? (y/n): ");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    console.log("Thank you for playing!");
    await rl.close();
  }
}

startGame(createPerson('123', '123', 1000)); // Sample call to start the game with an example player

