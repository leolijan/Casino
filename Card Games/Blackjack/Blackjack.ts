import { readUserInput } from "../../userInput/readUserInput";
import { createBlackjackDeck, Card, 
         dealInitialCards, showHand, Deck} from "../Deck/Deck";
import { Person} from "../../Player/Player";


/**
 * Calculates the total value of a hand in Blackjack, taking into account the 
 * special rules for Aces (value of 11 or 1 to avoid busting if possible).
 * @param {Array<Card>} hand - The array of cards in the hand.
 * @returns {number} The total value of the hand.
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
 * @param {Array<Card>} hand - The hand to check.
 * @returns {boolean} True if the hand is a blackjack, false otherwise.
 */
export function checkForBlackjack(hand: Array<Card>): boolean {
  const value : number = calculateHandValue(hand);
  return hand.length === 2 && value === 21;
}

/**
 * Handles the player's turn in a game of Blackjack, 
 * allowing them to hit, stand, or double down.
 * @param {Array<Card>} deck - The current deck of cards.
 * @param {Person} player - The player object.
 * @param {number} bet - The current bet amount.
 * @returns {Promise<boolean>} - Returns false if the player's turn 
 * ends (blackjack or bust) or true if the player stands.
 */
export async function playerTurn(deck: Array<Card>, 
                                 player: Person, 
                                 bet: number): Promise<boolean> {
  // Calculate the initial total of the player's hand.
  let playerTotal: number = calculateHandValue(player.hand); 
  let doubledDown: boolean = false; // Tracks if the player has doubled down

  // Check if the player starts with a Blackjack.
  if (checkForBlackjack(player.hand)) { 
    console.log("Blackjack! You win 1.5x your bet.");
    player.balance += bet * 1.5; // Award the player with 1.5 times their bet
    return false; // End the player's turn
  }

  // Player's decision-making loop
  while (playerTotal < 21) {
    console.log(`Your total is ${playerTotal}.`);
    const prompt: string = "Hit (h), stand (s), or double down (d)?"; 
    const hitOrStand: string = await readUserInput(prompt, 3); 

    // Handle the double down option
    if (hitOrStand.toLowerCase() === "d" && 
        !doubledDown && player.hand.length === 2) { 
      player.balance -= bet; // Deduct an additional bet for doubling down
      bet *= 2; // Double the bet
      player.hand.push(deck.pop()!); // Draw one card
      console.log("You doubled down and drew a card.");
      doubledDown = true; // Mark as doubled down
      playerTotal = calculateHandValue(player.hand); 
      break; // Exit the loop after doubling down
    } else if (hitOrStand.toLowerCase() === "h") { // Handle hit option
      player.hand.push(deck.pop()!); // Draw a card
      console.log("You drew a card.");
      playerTotal = calculateHandValue(player.hand); // Recalculate total
    } else {
      break; // Player chooses to stand
    }
  }

  // Show the player's hand after they've finished making decisions
  await showHand(player); 
  if (playerTotal > 21) {
    console.log("Bust! You lose.");
    player.balance -= bet; // Deduct the bet for losing
    return false; // Player loses
  }
  return true; // Player stands without busting
}

/**
 * Handles the dealer's turn in Blackjack, 
 * drawing cards until the total value is 17 or higher.
 * @param {Array<Card>} deck - The deck of cards used in the game.
 * @param {Person} dealer - The dealer's hand.
 * @returns {Promise<number>} The total value of the dealer's hand at 
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
 * @param {Person} player - The player making the bet.
 * @returns {Promise<number>} The amount bet by the player.
 */
export async function getBet(player: Person): Promise<number> {
  let bet: number = 0;
  do {
    // Prompt the player for their bet amount, displaying their current balance
    const prompt: string = 
      `You have $${player.balance}. How much would you like to bet? `;
    const betString: string = await readUserInput(prompt, player.balance); 
    bet = parseInt(betString, 10); // Convert the input string to a number.

    // Validate the bet amount to ensure it's a positive number and 
    //not more than the player's balance
    if (isNaN(bet) || bet <= 0 || bet > player.balance) {
      console.log("Invalid bet amount. Please enter a valid number " +
                  "within your balance.");
    }
  } while (isNaN(bet) || bet <= 0 || bet > player.balance);
  
  return bet; // Return the validated bet amount
}

/**
 * Starts and manages the Blackjack game.
 * @param player The player represented as a Person object.
 */
export async function startGame(player: Person): Promise<void> {
  // Declare variables for game state
  let deck: Deck;
  let dealer: Person;
  let bet: number;
  let playerBusts: boolean;
  let dealerTotal: number;
  let playerTotal: number;
  let playAgain: string;

  // Main game loop
  do {
    // Reset player's and dealer's hands at the start of each game
    player.hand = [];
    deck = createBlackjackDeck();
    dealer = { name: "Dealer", password: "123", balance: 0, hand: [] };

    console.log("Welcome to Blackjack!");
    // Prompt player for their bet
    bet = await getBet(player);
    // Deal initial cards to player and dealer
    await dealInitialCards(deck, player);
    await dealInitialCards(deck, dealer);
    // Show player's hand
    await showHand(player);

    // Player's turn to hit or stand
    playerBusts = !(await playerTurn(deck, player, bet));
    // Check if player busted
    if (playerBusts) {
      console.log(`You lost $${bet}. Your new balance is $${player.balance}.`);
    } else {
      // Dealer's turn to play
      dealerTotal = await dealerTurn(deck, dealer);
      playerTotal = calculateHandValue(player.hand);

      // Determine the outcome of the game
      if (dealerTotal > 21 || playerTotal > dealerTotal) {
        console.log("You win!");
        player.balance += bet;
        console.log(`You won $${bet}. Your new balance is $${player.balance}.`);
      } else if (playerTotal < dealerTotal) {
        console.log("Dealer wins.");
        player.balance -= bet;
        console.log(`You lost $${bet}. Your new balance is $${player.balance}.`);
      } else {
        console.log("It's a tie (push).");
      }
    }

    // Check if player has run out of funds
    if (player.balance <= 0) {
      console.log("You've run out of funds! Game over.");
      break;
    }

    // Ask player if they want to play again
    const playAgainOptions: string = 
      "Would you like to play again? Yes(1) or No(2): ";
    playAgain = await readUserInput(playAgainOptions, 2);
  } while (playAgain === "1");

  // Game over message
  console.log("Thank you for playing!");
}


