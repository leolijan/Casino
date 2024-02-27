import { readUserInput } from '../../userInput/readUserInput';
import { createBlackjackDeck as createBaccaratDeck, Card, 
         isPair, dealInitialCards, showHand } from '../Deck/Deck';
import { Person, createPerson } from '../../Player/Player';

/**
 * Calculates the total value of the hand, according to the rules of baccarat.
 * @param hand An array of Card objects representing the hand.
 * @returns A Promise resolving to the calculated hand value.
 */
export async function calculateHandValue(hand: Array<Card>): Promise<number> {
  let total = 0;

  hand.forEach(card => {
    if (card.value >= 10 && card.value <= 13) {
      total += 0;
    }
    else if (card.value === 14) {
      total += 1;
    }
    else {
      total += card.value;
    }
  });

  // Hands are valued modulo 10.
  return (total % 10);
}


/**
 * Manages the player's hand according to the rules of baccarat
 * @param deck An array of Card objects representing the deck.
 * @param player A Person object representing the player.
 * @returns The total value of the player hand.
 */
export async function playerHand(deck: Array<Card>, 
                                 player: Person): Promise<number> {
  let playerTotal = await calculateHandValue(player.hand);
  
  if (playerTotal >= 6) {
    return playerTotal;
  } else {
    player.hand.push(deck.pop()!);
    return (await calculateHandValue(player.hand));
  }
}


/**
 * Manages the banker's hand by following specific drawing rules that are based
 * on the value of the banker's hand and the player's third card.
 * @param deck The deck of cards that are represented as an array of type Card.
 * @param banker A Person object representing the banker.
 * @param player A Person object representing the player.
 * @returns The total value of the banker's hand.
 */
export async function bankerHand(deck: Array<Card>, 
                                 banker: Person, 
                                 player: Person): Promise<number> {
  let bankerTotal = await calculateHandValue(banker.hand);

  // Draws a third card for the banker and calculates the new card values
  async function bankerThirdCard(): Promise<number> {
    banker.hand.push(deck.pop()!);
    return (await calculateHandValue(banker.hand));
  }

  // Specific rules for drawing of banker's third card
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
  } else {}

  return bankerTotal;
}


/**
 * Decides the outcome of the game based on the type of bet made and
 * the player and banker hands.
 * @param playerValue Total value of the player's hand.
 * @param bankerValue Total value of the banker's hand.
 * @param playerHand The player's hand.
 * @param bankerHand The banker's hand.
 * @param betType Type of bet made by the player.
 * @returns An object containing the outcome and potential winnings.
 */
export async function decideOutcome(playerValue: number, 
                             bankerValue: number, 
                             playerHand: Array<Card>, 
                             bankerHand: Array<Card>, 
                             betType: string)
                             : Promise<{ outcome: string; winnings: number }> {
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


/**
 * Starts and manages the Baccarat game.
 * @param player The player represented as a Person object.
 */
export async function startGame(player: Person) {
  player.hand = [];
  const deck = createBaccaratDeck();
  const banker: Person = { name: "Banker", password: "", balance: 0, hand: [] };

  const prompt = "You have $" + player.balance + ". How much would you like to bet? ";
  const bet = await readUserInput(prompt, player.balance);
  
  console.log("Welcome to Baccarat!");
  
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
    
  } else {}

  const playAgainOptions = "Would you like to play again? Yes(1) or No(2): "
  userInput = await readUserInput(playAgainOptions, 2);
  if(userInput==="1"){
    startGame(player);  
  } else {}

}

//startGame(createPerson('123', '123', 1000));
