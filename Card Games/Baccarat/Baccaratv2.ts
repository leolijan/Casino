import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { createBlackjackDeck, Card } from '../Deck/Deck';
import { Person, createPerson } from '../../Player/Player';

const rl = createInterface({ input, output });

const ensureDeckNotEmpty = (deck: Card[]): void => {
  if (deck.length < 10) {
    const newDeck = createBlackjackDeck();
    deck.push(...newDeck);
  }
};

async function dealInitialCards(deck: Card[], person: Person): Promise<void> {
  ensureDeckNotEmpty(deck);
  person.hand.push(deck.pop()!, deck.pop()!);
}

function showHand(person: Person): void {
  console.log(`${person.name}'s hand: ${person.hand.map(card => `${card.value} of ${card.suit}`).join(', ')}`);
}

async function calculateHandValue(hand: Card[]): Promise<number> {
  let total = 0;

  hand.forEach(card => {
    if (card.value >= 10 && card.value <= 13) total += 0;
    else if (card.value === 14) total += 1;
    else total += card.value;
  });

  // Hands are valued modulo 10.
  return (total % 10);
}

async function checkForNatural(hand: Card[]): Promise<boolean> {
  const value = await calculateHandValue(hand);
  return hand.length === 2 && (value === 8 || value === 9);
}

async function playerHand(deck: Card[], player: Person): Promise<number> {
  let playerTotal = await calculateHandValue(player.hand);
  
  if (playerTotal >= 6) {
    return playerTotal;
  } else {
    player.hand.push(deck.pop()!);
    return (await calculateHandValue(player.hand));
  }
}

async function bankerHand(deck: Card[], banker: Person, player: Person): Promise<number> {
    let bankerTotal = await calculateHandValue(banker.hand);
  
    async function bankerThirdCard(): Promise<number> {
        banker.hand.push(deck.pop()!);
        return (await calculateHandValue(banker.hand));
    }

    // Specific rules for the banker's third card
    /*
    If the banker total is 2 or less, they draw a third card regardless of what the player's third card is.
    If the banker total is 3, they draw a third card unless the player's third card is an 8.
    If the banker total is 4, they draw a third card if the player's third card is 2, 3, 4, 5, 6, or 7.
    If the banker total is 5, they draw a third card if the player's third card is 4, 5, 6, or 7.
    If the banker total is 6, they draw a third card if the player's third card is a 6 or 7.
    If the banker total is 7, they stand.
    */
    async function bankerRules(): Promise<number> {
        const playerThirdCard = player.hand[2].value;
        if (bankerTotal <= 2) {
            return bankerThirdCard();
        } else if (bankerTotal === 3 && playerThirdCard === 8) {
            return bankerThirdCard();
        } else if (bankerTotal === 4 && 
                   (playerThirdCard >= 2 && playerThirdCard <= 7)) {
            return bankerThirdCard();
        } else if (bankerTotal === 5 && 
                   (playerThirdCard >= 4 && playerThirdCard <= 7)) {
            return bankerThirdCard();
        } else if (bankerTotal === 6 && 
                   (playerThirdCard === 6 || playerThirdCard === 7)) {
            return bankerThirdCard();
        } else {
            return bankerTotal;
        }
    }

    if (bankerTotal <= 5) {
        if (player.hand.length === 3) {
            return bankerRules();
        } else {
            return bankerThirdCard();
        }
    }

    return bankerTotal;
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
      const banker: Person = { name: 'Banker', password: '', balance: 0, hand: [] };

      const bet = await getBet(Player);
      
      console.log('Welcome to Baccarat!');
      
      
      const playerOrBanker = await rl.question("Do you want to bet on the (p)layer's hand or the (b)anker's hand ");
      
      await dealInitialCards(deck, Player);
      await dealInitialCards(deck, banker);

      await showHand(Player);
      await showHand(banker);
    
      const finalPlayerHand = await playerHand(deck, Player);
      const finalBankerHand = await bankerHand(deck, banker, Player);
      
      console.log(finalPlayerHand);
      console.log(finalBankerHand);

      if (playerOrBanker.toLowerCase() === 'p') {
        if (finalPlayerHand > finalBankerHand) {
            console.log("You win!");
        } else {
            console.log("You lose.");
        }
      } else if (playerOrBanker.toLowerCase() === 'b') {
        if (finalBankerHand > finalPlayerHand) {
            console.log("You win!");
        } else {
            console.log("You lose.");
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