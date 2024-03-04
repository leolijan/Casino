import { readUserInput } from "../../../Utilities/userInput/readUserInput";
import { createBlackjackDeck, Card, Deck,
         dealInitialCards, showHand} from "../Deck/Deck";
import { Person, createPerson} from "../../../Utilities/Player/Player";


/**
 * Calculates the total value of a hand in Blackjack, accounting for Aces as either 1 or 11.
 *
 * @example
 * // Assuming hand contains an Ace (value 14), a King (value 13), and a 7
 * calculateHandValue([{value: 14}, {value: 13}, {value: 7}]);
 * // Returns 18, as Ace is counted as 1 to avoid busting
 *
 * @param hand Array of Card objects representing the hand.
 * @returns The total value of the hand, adjusting Aces to avoid busting if possible.
 */
export function calculateHandValue(hand: Array<Card>): number {
  let total: number = 0;
  
  // Count the number of Aces in the hand (Aces are represented as value 14)
  let aceCount: number = hand.filter(card => card.value === 14).length;

  // Iterate over each card in the hand to calculate the total value
  hand.forEach(card => {
    if (card.value >= 11 && card.value <= 13) {
      // Face cards (Jack, Queen, King) are worth 10 points
      total += 10;
    } else if (card.value === 14) {
      // Aces are initially counted as 11 points
      total += 11;
    } else {
      // Other cards are worth their face value
      total += card.value;
    }
  });

  // Adjust for Aces: if total value exceeds 21 and there are Aces in the hand,
  // convert some Aces from 11 points to 1 point to reduce the total value
  while (total > 21 && aceCount > 0) {
    total -= 10; 
    aceCount--; 
  }

  return total;
}


/**
 * Determines if a hand qualifies as a blackjack (total value of 21 with exactly two cards).
 *
 * @example
 * // Assuming hand contains an Ace (value 14) and a King (value 13)
 * checkForBlackjack([{value: 14}, {value: 13}]);
 * // Returns true
 *
 * @param hand Array of Card objects representing the hand.
 * @returns True if the hand is a blackjack, false otherwise.
 */
export function checkForBlackjack(hand: Array<Card>): boolean {
  const value : number = calculateHandValue(hand);
  return hand.length === 2 && value === 21;
}


/**
 * Manages the player's actions during their turn in Blackjack, offering options to hit, stand, or double down.
 *
 * @example
 * // Assuming a deck, a player, and an initial bet are defined
 * const turnOutcome = await playerTurn(deck, player, 100);
 * // turnOutcome indicates if the player's turn ended due to blackjack, bust, or if they stood
 *
 * @param deck The current deck of cards.
 * @param player A Person object representing the player.
 * @param originalBet The current bet amount placed by the player.
 * @returns False if the player's turn ends due to blackjack or bust, true if the player stands.
 */
export async function playerTurn(deck: Array<Card>, 
                                 player: Person, 
                                 originalBet: number): Promise<boolean> {

  let playerTotal: number = calculateHandValue(player.hand);
  let bet = originalBet; 
  let doubledDown: boolean = false;

  while (playerTotal < 21) {
    console.log(`Your total is ${playerTotal}.`);
    const prompt: string = "Hit (1), stand (2), or double down (3)? " +
                           "(Current balance: $" + player.balance + ")";
    const hitOrStand: string = await readUserInput(prompt, 3);

    if (hitOrStand === "3" && !doubledDown && 
        player.hand.length === 2 && player.balance >= bet * 2) {

      player.balance -= bet; 
      bet *= 2; 

      player.hand.push(deck.pop()!); // Draw one card
      console.log("You doubled down and drew a card.");
      doubledDown = true; // Mark as doubled down

      playerTotal = calculateHandValue(player.hand);
      break;
    } else if (hitOrStand === "1") {
        player.hand.push(deck.pop()!);
        console.log("You drew a card.");
        playerTotal = calculateHandValue(player.hand);
    } else if (hitOrStand === "2") {
        break; 
    }
  }

  await showHand(player);
  if (playerTotal > 21) {
    console.log("Bust! You lose.");
    player.balance -= bet;
    return false; // Player busts
  }
  return true; // Player stands without busting
}


/**
 * Manages the dealer's turn in Blackjack, drawing cards until the hand's total is at least 17.
 *
 * @example
 * // Assuming deck and dealer are defined, with the dealer's hand initially visible
 * const dealerTotal = await dealerTurn(deck, dealer);
 * // Dealer's hand is automatically managed according to Blackjack rules
 *
 * @param deck The deck of cards used in the game.
 * @param dealer A Person object representing the dealer.
 * @returns The total value of the dealer's hand at the end of their turn.
 */
export async function dealerTurn(deck: Array<Card>, 
                                 dealer: Person): Promise<number> {
  // Initially calculate the dealer's total hand value
  let dealerTotal: number = calculateHandValue(dealer.hand);

  // Check if the dealer has a blackjack
  if (checkForBlackjack(dealer.hand)) {
    console.log("Dealer has Blackjack!");
    return 21; 
  }

  // Dealer draws cards until the total is 17 or higher
  while (dealerTotal < 17) {
    dealer.hand.push(deck.pop()!);

    // Recalculate the dealer's total hand value after drawing a card
    dealerTotal = calculateHandValue(dealer.hand);
  }

  // Show dealer's hand to the player
  await showHand(dealer);

  return dealerTotal;
}


/**
 * Prompts the player to place a bet within their available balance.
 *
 * @example
 * // Assuming player has a balance defined
 * const betAmount = await getBet(player);
 * // Player is prompted for a bet amount, ensuring it's within their balance
 *
 * @param player The player making the bet, containing their balance.
 * @returns The amount bet by the player, validated to be within their balance.
 */
export async function getBet(player: Person): Promise<number> {
  let bet: number = 0;
  const prompt: string = 
                `You have $${player.balance}. How much would you like to bet? `;

  // readUserInput handles invalid inputs
  const betString: string = await readUserInput(prompt, player.balance); 
  bet = parseInt(betString, 10);

  return bet; 
}

/**
 * Initiates and manages a game session of Blackjack for the player.
 *
 * @example
 * // Assuming a player object is already defined
 * await startGame(player);
 * // Engages the player in a session of Blackjack, handling initial bets, card dealing, and decisions.
 *
 * @param player The player participating in the game, represented as a Person object.
 *
 * @returns void. Manages the game flow, including dealing cards, taking player actions, and settling bets, with an option to replay.
 */
export async function startGame(player: Person): Promise<void> {
  let deck: Deck;
  let dealer: Person = createPerson("Dealer", "", 0);
  let bet: number;
  let playAgain: string = '';

  do {
    player.hand = [];
    dealer.hand = [];
    deck = createBlackjackDeck();
    console.log("Welcome to Blackjack!");

    bet = await getBet(player); 

    dealInitialCards(deck, player);
    dealInitialCards(deck, dealer);

    console.log("Your hand:");
    showHand(player); 

    const dealerFirstCard = dealer.hand[0];
    console.log(`Dealer's first card: ` + 
                `${dealerFirstCard.value} of ${dealerFirstCard.suit}`);

    if (checkForBlackjack(player.hand) && checkForBlackjack(dealer.hand)) {
      console.log("Both you and the dealer have Blackjack! It's a push.");
      
    } else if (checkForBlackjack(player.hand)) {
      console.log("Blackjack! You win 1.5x your bet.");
      player.balance += bet * 1.5;

    } else {
      let playerTurnOutcome = await playerTurn(deck, player, bet);

      if (!playerTurnOutcome) {
        console.log("You bust!");
        player.balance -= bet;
      } else {
        let dealerTotal = await dealerTurn(deck, dealer);
        let playerTotal = calculateHandValue(player.hand);
        
        if (dealerTotal > 21 || playerTotal > dealerTotal) {
          console.log("You win!");
          player.balance += bet;
        } else if (playerTotal < dealerTotal) {
          console.log("Dealer wins.");
          player.balance -= bet;
        } else {
          console.log("It's a push.");
        }

      }
    }

    if (player.balance > 0) {
      const playAgainPrompt = "Do you want to play again? Yes(1) No(2): ";
      playAgain = await readUserInput(playAgainPrompt, 2);
    } else {
      console.log("You've run out of funds! Game over.");
      break;
    }
  } while (playAgain === "1");

  console.log("Thank you for playing!");
}
