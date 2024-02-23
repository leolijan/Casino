import { readUserInput } from '../../userInput/readUserInput';
import { createBlackjackDeck, Card, ensureDeckNotEmpty, isPair, dealInitialCards } from '../Deck/Deck';
import { Person, createPerson } from '../../Player/Player';

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

  // Draws a third card for the banker and calculates the new card values
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
        console.log("player.hand.length === 3")
        return bankerRules();
      } else {
        return bankerThirdCard();
      }
  }

  return bankerTotal;
}

async function decideOutcome(playerValue: number, bankerValue: number, playerHand: Card[], bankerHand: Card[], betType: string): Promise<{ outcome: string; winnings: number }> {
  let outcome = '';
  let winnings = 0;

  switch (betType) {
      case "1":
          if (playerValue > bankerValue) {
              outcome = 'Win';
              winnings = 2;
          } else {
              outcome = 'Lose';
          }
          break;
      case "2":
          if (bankerValue > playerValue) {
              outcome = 'Win';
              winnings = 1.95; // 5% commission
          } else {
              outcome = 'Lose';
          }
          break;
      case "3":
          if (playerValue === bankerValue) {
              outcome = 'Win';
              winnings = 8;
          } else {
              outcome = 'Lose';
          }
          break;
      case "4":
          if (isPair(playerHand)) {
              outcome = 'Win';
              winnings = 11;
          } else {
              outcome = 'Lose';
          }
          break;
      case "5":
          if (isPair(bankerHand)) {
              outcome = 'Win';
              winnings = 11;
          } else {
              outcome = 'Lose';
          }
          break;
      default:
          outcome = 'Lose';
          break;
  }

  return { outcome, winnings };
}


export async function startGame(player: Person) {
  player.hand = [];
  const deck = createBlackjackDeck();
  const banker: Person = { name: 'Banker', password: '', balance: 0, hand: [] };

  const bet = await readUserInput(`You have $${player.balance}. How much would you like to bet? `, player.balance);
  
  console.log('Welcome to Baccarat!');
  
  const options = "1. Bet on Player hand\n" +
                  "2. Bet on Banker hand\n" +
                  "3. Bet on a tie\n" +
                  "4. Bet on a player pair\n" +
                  "5. Bet on a banker pair\n";
  let userInput = await readUserInput(options, 5);
  
  await dealInitialCards(deck, player);
  await dealInitialCards(deck, banker);

  const finalPlayerHand = await playerHand(deck, player);
  const finalBankerHand = await bankerHand(deck, banker, player);
  
  await showHand(player);
  await showHand(banker);

  console.log("Final value for player hand: " + finalPlayerHand);
  console.log("Final value for banker hand: " + finalBankerHand);
  const { outcome, winnings } = await decideOutcome(finalPlayerHand,
                                                    finalBankerHand, player.hand, 
                                                    banker.hand, userInput);

  if (outcome === "Win") {
      console.log("You win");
      player.balance += Number(bet) * winnings;
  } else {
      console.log("You lose");
      player.balance -= Number(bet);
  }
  
  if (player.balance <= 0) {
    console.log("You've run out of funds! Game over.");
    
  }

  const playAgainOptions = "Would you like to play again? Yes(1) or No(2): "
  userInput = await readUserInput(playAgainOptions, 2);
  if(userInput==="1"){
    startGame(player);  
  } else {}

}

startGame(createPerson('123', '123', 1000));
