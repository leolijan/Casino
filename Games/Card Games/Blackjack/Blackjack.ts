import { readUserInput } from "../../../Utilities/userInput/readUserInput";
import { createBlackjackDeck, Card, 
         dealInitialCards, showHand, Deck} from "../Deck/Deck";
import { Person, createPerson} from "../../../Utilities/Player/Player";

/**
 * Calculates the total value of a hand in Blackjack, taking into account the 
 * special rules for Aces (value of 11 or 1 to avoid busting if possible).
 * @param hand An array of Card objects representing the hand.
 * @returns The total value of the hand.
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
    total -= 10; // Subtracting 10 adjusts an Ace from 11 points to 1 point
    aceCount--; // Decrement the count of Aces that are being treated as 11
  }

  return total;
}

/**
 * Checks if a hand is a blackjack (a total value of 21 with exactly two cards)
 * @param hand The hand to check.
 * @returns True if the hand is a blackjack, false otherwise.
 */
export function checkForBlackjack(hand: Array<Card>): boolean {
  const value : number = calculateHandValue(hand);
  return hand.length === 2 && value === 21;
}

/**
 * Handles the player's turn in a game of Blackjack, 
 * allowing them to hit, stand, or double down.
 * @param deck The current deck of cards.
 * @param player A Person object representing the player..
 * @param bet The current bet amount.
 * @returns Returns false if the player's turn 
 * ends (blackjack or bust) or true if the player stands.
 */
export async function playerTurn(deck: Array<Card>, player: Person, originalBet: number): Promise<boolean> {
  let playerTotal: number = calculateHandValue(player.hand);
  let bet = originalBet; // Use a local variable for bet to handle doubling down
  let doubledDown: boolean = false;

  while (playerTotal < 21) {
    console.log(`Your total is ${playerTotal}.`);
    const prompt: string = "Hit (1), stand (2), or double down (3)? (Current balance: $" + player.balance + ")";
    const hitOrStand: string = await readUserInput(prompt, 3);

    if (hitOrStand === "3" && !doubledDown && player.hand.length === 2 && player.balance >= bet * 2) {
      player.balance -= bet; // Deduct an additional bet for doubling down
      bet *= 2; // Double the bet
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
    player.balance -= bet; // Adjust the balance for the final bet amount
    return false; // Player busts
  }
  return true; // Player stands without busting
}


/**
 * Handles the dealer's turn in Blackjack, 
 * drawing cards until the total value is 17 or higher.
 * @param deck The deck of cards used in the game.
 * @param dealer A Person object representing the dealer.
 * @returns The total value of the dealer's hand at 
 * the end of their turn.
 */
export async function dealerTurn(deck: Array<Card>, 
                                 dealer: Person): Promise<number> {
  // Initially calculate the dealer's total hand value
  let dealerTotal: number = calculateHandValue(dealer.hand);

  // Check if the dealer has a blackjack
  if (checkForBlackjack(dealer.hand)) {
    console.log("Dealer has Blackjack!");
    return 21; // Blackjack value
  }

  // Dealer draws cards until the total is 17 or higher
  while (dealerTotal < 17) {
    // Safely pop a card from the deck and add it to the dealer's hand
    dealer.hand.push(deck.pop()!);
    // Recalculate the dealer's total hand value after drawing a card
    dealerTotal = calculateHandValue(dealer.hand);
  }

  // Show dealer's hand to the player
  await showHand(dealer);

  return dealerTotal;
}


/**
 * Prompts the player to place a bet, ensuring the bet is within their 
 * available balance.
 * @param player The player making the bet.
 * @returns The amount bet by the player.
 */
export async function getBet(player: Person): Promise<number> {
  let bet: number = 0;
  const prompt: string = 
      `You have $${player.balance}. How much would you like to bet? `;
  //Readuserinputs handles invalid inputs
  const betString: string = await readUserInput(prompt, player.balance); 
  bet = parseInt(betString, 10); // Convert the input string to a number.
  return bet; // Return the validated bet amount
}

/**
 * Starts and manages the Blackjack game.
 * @param player The player represented as a Person object.
 */
export async function startGame(player: Person): Promise<void> {
  let deck: Card[];
  let dealer: Person = createPerson("Dealer", "", 0);
  let bet: number;
  let playAgain: string = '';

  do {
    player.hand = [];
    dealer.hand = [];
    deck = createBlackjackDeck();
    console.log("Welcome to Blackjack!");

    bet = await getBet(player); // Assuming getBet is properly implemented

    dealInitialCards(deck, player);
    dealInitialCards(deck, dealer);

    console.log("Your hand:");
    showHand(player); // Assuming showHand is properly implemented

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
      playAgain = await readUserInput("Do you want to play again? (Yes=1/No=2): ", 2);
    } else {
      console.log("You've run out of funds! Game over.");
      break;
    }
  } while (playAgain === "1");

  console.log("Thank you for playing!");
}
