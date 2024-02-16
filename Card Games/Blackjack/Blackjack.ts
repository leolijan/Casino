import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { createBlackjackDeck, Card } from '../Deck/Deck';
import { Person, createPerson } from '../../Player/Player';

const rl = createInterface({ input, output });

// Function to ensure the deck is replenished if needed
const ensureDeckNotEmpty = (deck: Card[]): void => {
  if (deck.length < 10) { // Arbitrary low number to avoid running out mid-turn
    const newDeck = createBlackjackDeck();
    deck.push(...newDeck);
  }
};

async function dealInitialCards(deck: Card[], person: Person): Promise<void> {
  ensureDeckNotEmpty(deck);
  person.hand.push(deck.pop()!, deck.pop()!);
}

async function showHand(person: Person): Promise<void> {
  console.log(`${person.name}'s hand: ${person.hand.map(card => `${card.value} of ${card.suit}`).join(', ')}`);
}

async function calculateHandValue(hand: Card[]): Promise<number> {
    let total = 0;
    let aceCount = hand.filter(card => card.value === 14).length; // Aces
  
    hand.forEach(card => {
      if (card.value >= 11 && card.value <= 13) total += 10; // Face cards
      else if (card.value === 14) total += 11; // Aces (temporarily count as 11)
      else total += card.value;
    });
  
    // Adjust Aces from 11 to 1 as needed
    while (total > 21 && aceCount > 0) {
      total -= 10; // Subtract 10 if we previously counted an Ace as 11
      aceCount--;
    }
  
    return total;
  }
  

async function playerTurn(deck: Card[], player: Person): Promise<boolean> {
  let playerTotal = await calculateHandValue(player.hand);
  while (playerTotal < 21) {
    console.log(`Your total is ${playerTotal}.`);
    const hitOrStand = await rl.question('Do you want to (h)it or (s)tand? ');

    if (hitOrStand.toLowerCase() === 'h') {
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
    return false; // Player busts
  }
  return true; // Player stands
}

async function dealerTurn(deck: Card[], dealer: Person): Promise<number> {
  let dealerTotal = await calculateHandValue(dealer.hand);
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
      bet = 0; // Reset bet to prompt again
    }
  } while (bet <= 0 || bet > player.balance);

  return bet;
}

export async function startGame(Player: Person) {
  try {
    let playAgain = 'y';

    while (playAgain.toLowerCase() === 'y') {
      const deck = createBlackjackDeck();
      const dealer: Person = { name: 'Dealer', password: '', balance: 0, hand: [] };

      const bet = await getBet(Player);

      await dealInitialCards(deck, Player);
      await dealInitialCards(deck, dealer);

      console.log('Welcome to Blackjack!');
      await showHand(Player);

      // Player's turn
      const playerBusts = !(await playerTurn(deck, Player));
      if (playerBusts) {
        Player.balance -= bet;
        console.log(`You lost $${bet}. Your new balance is $${Player.balance}.`);
      } else {
        // Continue with dealer's turn if player doesn't bust
        const dealerTotal = await dealerTurn(deck, dealer);
        const playerTotal = await calculateHandValue(Player.hand);

        // Determine the outcome after both turns are complete
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
          // No balance adjustment on tie
        }
      }

      // Check if player still has balance to play
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


