import { readUserInput } from '../../userInput/readUserInput';
import { createBlackjackDeck, Card, dealInitialCards, showHand } from '../Deck/Deck';
import { Person, createPerson } from '../../Player/Player';


/**
 * Calculates the total value of a hand in Blackjack, taking into account the 
 * special rules for Aces (value of 11 or 1 to avoid busting if possible).
 * @param {Card[]} hand - The array of cards in the hand.
 * @returns {number} The total value of the hand.
 */
export function calculateHandValue(hand: Card[]): number {
  let total = 0;
  let aceCount = hand.filter(card => card.value === 14).length;

  hand.forEach(card => {
    if (card.value >= 11 && card.value <= 13) {
      total += 10;
    } else if (card.value === 14) {
      total += 11;
    } else {
      total += card.value;
    }
  });

  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }

  return total;
}

/**
 * Checks if a hand is a blackjack (a total value of 21 with exactly two cards).
 * @param {Card[]} hand - The hand to check.
 * @returns {boolean} True if the hand is a blackjack, false otherwise.
 */
export function checkForBlackjack(hand: Card[]): boolean {
  const value = calculateHandValue(hand);
  return hand.length === 2 && value === 21;
}

/**
 * Handles the player's turn in a game of Blackjack, allowing them to hit, stand, or double down.
 * @param {Card[]} deck - The current deck of cards.
 * @param {Person} player - The player object.
 * @param {number} bet - The current bet amount.
 * @returns {Promise<boolean>} - Returns false if the player's turn ends (blackjack or bust) or true if the player stands.
 */
export async function playerTurn(deck: Card[], player: Person, bet: number): Promise<boolean> {
  let playerTotal = calculateHandValue(player.hand); 
  let doubledDown = false;

  if (checkForBlackjack(player.hand)) { 
    console.log("Blackjack! You win 1.5x your bet.");
    player.balance += bet * 1.5;
    return false;
  }

  while (playerTotal < 21) {
    console.log(`Your total is ${playerTotal}.`);
    const hitOrStand = await readUserInput('Do you want to hit(1), stand(2), or double down(3)? ', 3);

    if (hitOrStand.toLowerCase() === 'd' && !doubledDown && player.hand.length === 2) {
      player.balance -= bet;
      bet *= 2;
      player.hand.push(deck.pop()!);
      console.log(`You doubled down and drew a card.`);
      doubledDown = true;
      playerTotal = calculateHandValue(player.hand); 
      break; // Exit loop since player decided to double down
    } else if (hitOrStand.toLowerCase() === 'h') {
      player.hand.push(deck.pop()!);
      console.log(`You drew a card.`);
      playerTotal = calculateHandValue(player.hand); 
    } else {
      break; // Player stands
    }
  }

  await showHand(player); // Ensure you have a function to display the player's hand
  if (playerTotal > 21) {
    console.log('Bust! You lose.');
    player.balance -= bet;
    return false;
  }
  return true; // Player stands
}

/**
 * Handles the dealer's turn in Blackjack, drawing cards until the total value is 17 or higher.
 * @param {Card[]} deck - The deck of cards used in the game.
 * @param {Person} dealer - The dealer's hand.
 * @returns {Promise<number>} The total value of the dealer's hand at the end of their turn.
 */
export async function dealerTurn(deck: Card[], dealer: Person): Promise<number> {
  let dealerTotal = calculateHandValue(dealer.hand); 

  if (checkForBlackjack(dealer.hand)) {
    console.log("Dealer has Blackjack!");
    return 21;
  }

  while (dealerTotal < 17) {
    dealer.hand.push(deck.pop()!);
    dealerTotal = calculateHandValue(dealer.hand); 
  }
  await showHand(dealer);
  return dealerTotal;
}

/**
 * Prompts the player to place a bet, ensuring the bet is within their available balance.
 * @param {Person} player - The player making the bet.
 * @returns {Promise<number>} The amount bet by the player.
 */
export async function getBet(player: Person): Promise<number> {
  let bet = 0;
  do {
    const betString = await readUserInput(`You have $${player.balance}. How much would you like to bet? `, player.balance); 
    bet = parseInt(betString, 10);
    if (isNaN(bet) || bet <= 0 || bet > player.balance) {
      console.log("Invalid bet amount. Please enter a valid number within your balance.");
    }
  } while (isNaN(bet) || bet <= 0 || bet > player.balance);

  return bet;
}


export async function startGame(player: Person) {
  let deck, dealer, bet, playerBusts, dealerTotal, playerTotal, playAgain;

  do {
    player.hand = [];
    deck = createBlackjackDeck();
    dealer = { name: 'Dealer', password : '123', balance: 0, hand: [] };

    console.log('Welcome to Blackjack!');
    bet = await getBet(player); 
    await dealInitialCards(deck, player);
    await dealInitialCards(deck, dealer);
    await showHand(player);

    playerBusts = !(await playerTurn(deck, player, bet));
    if (playerBusts) {
      console.log(`You lost $${bet}. Your new balance is $${player.balance}.`);
    } else {
      dealerTotal = await dealerTurn(deck, dealer);
      playerTotal = calculateHandValue(player.hand);

      if (dealerTotal > 21 || playerTotal > dealerTotal) {
        console.log('You win!');
        player.balance += bet;
        console.log(`You won $${bet}. Your new balance is $${player.balance}.`);
      } else if (playerTotal < dealerTotal) {
        console.log('Dealer wins.');
        player.balance -= bet;
        console.log(`You lost $${bet}. Your new balance is $${player.balance}.`);
      } else {
        console.log("It's a tie (push).");
      }
    }

    if (player.balance <= 0) {
      console.log("You've run out of funds! Game over.");
      break;
    }

    const playAgainOptions = "Would you like to play again? Yes(1) or No(2): "
    playAgain = await readUserInput(playAgainOptions, 2);
  } while (playAgain.toLowerCase() === '1');

  console.log("Thank you for playing!");
}


startGame(createPerson('123', '123', 1000)); // Sample call to start the game with an example player

