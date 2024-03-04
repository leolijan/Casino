import { readUserInput } from '../../../Utilities/userInput/readUserInput';
import { createBlackjackDeck as createBaccaratDeck, 
         Card, isPair, dealInitialCards, showHand } from '../Deck/Deck';
import { Person } from '../../../Utilities/Player/Player';


/**
 * Calculates the total value of a baccarat hand from Card objects.
 *
 * @example
 * // Given a hand with cards of value 5, 1, and 14 (Ace)
 * calculateHandValue([{value: 5}, {value: 1}, {value: 14}]);
 * // Returns 7, as Aces are worth 1 and face cards are worth 0
 *
 * @param hand Array of Card objects representing the hand.
 * @returns The baccarat value of the hand, calculated modulo 10.
 */
export function calculateHandValue(hand: Array<Card>): number {
  let total = 0;

  // Calculates card values according to the rules of Baccarat.
  hand.forEach(card => {
    if (card.value >= 10 && card.value <= 13) {
      total += 0;
    } else if (card.value === 14) {
      total += 1;
    } else {
      total += card.value;
    }
  });

  // Hands are valued modulo 10.
  return (total % 10);
}


/**
 * Manages the player's hand in a game of baccarat, drawing a third card if necessary.
 *
 * @example
 * // Assuming a deck and a player with an initial hand
 * const total = await playerHand(deck, player);
 * // Returns the total value of the player's hand according to baccarat rules
 *
 * @param deck The current deck of cards.
 * @param player A Person object representing the player.
 * @returns The total value of the player's hand after potentially drawing a third card.
 */
export async function playerHand(deck: Array<Card>, 
                                 player: Person): Promise<number> {
  let playerTotal = await calculateHandValue(player.hand);
  
  // Depending on the value of the first two cards, either no more cards 
  // will be drawn or a third card will be drawn.
  if (playerTotal >= 6) {
    return playerTotal;
  } else {
    player.hand.push(deck.pop()!);
    return (await calculateHandValue(player.hand));
  }
}


/**
 * Determines the banker's hand value by applying baccarat drawing rules based on 
 * the banker's current hand and the player's third card value.
 *
 * @example
 * // Assuming a deck and both banker and player with initial hands
 * const bankerTotal = await bankerHand(deck, banker, player);
 * // Calculates and returns the total value of the banker's hand according to baccarat rules
 *
 * @param deck The deck of cards, represented as an array of Card objects.
 * @param banker A Person object representing the banker.
 * @param player A Person object representing the player, to consider player's third card if drawn.
 * @returns The total value of the banker's hand after applying drawing rules.
 */
export async function bankerHand(deck: Array<Card>, 
                                 banker: Person, 
                                 player: Person): Promise<number> {

  let bankerTotal = await calculateHandValue(banker.hand);

  // Draws a third card for the banker and calculates the new card values.
  async function bankerThirdCard(): Promise<number> {
    banker.hand.push(deck.pop()!);
    return (await calculateHandValue(banker.hand));
  }

  // Specific rules for drawing of banker's third card.
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
    } else {
      return bankerTotal;
    }
  }
    
  // Depending on the value of the first two cards and the rules of the banker,
  // either no more cards will be drawn or a third card will be drawn.
  if (bankerTotal <= 5) {
      if (player.hand.length === 3) {
        return bankerRules();
      } else {
        return bankerThirdCard();
      }
  } else {}

  return bankerTotal;
}


/**
 * Determines the game outcome and winnings based on the bet type and hand values.
 *
 * @example
 * // Assuming playerValue of 8, bankerValue of 7, and bet on player
 * decideOutcome(8, 7, playerHand, bankerHand, "1");
 * // Returns { outcome: "Win", winnings: 2 }
 *
 * @param playerValue Total value of the player's hand.
 * @param bankerValue Total value of the banker's hand.
 * @param playerHand Array of player's Card objects.
 * @param bankerHand Array of banker's Card objects.
 * @param betType String indicating the type of bet made.
 * @returns An object containing 'outcome' and 'winnings'.
 */
export function decideOutcome(playerValue: number, 
                              bankerValue: number, 
                              playerHand: Array<Card>, 
                              bankerHand: Array<Card>, 
                              betType: string)
                              : { outcome: string; winnings: number } {                
  let outcome = "";
  let winnings = 0;

  // Decides the outcome based on the option chosen by the player.
  if (betType === "1") {
    if (playerValue > bankerValue) {
      outcome = "Win";
      winnings = 2;
    } else {
      outcome = "Lose";
    }
  } else if (betType === "2") {
    if (bankerValue > playerValue) {
      outcome = "Win";
      winnings = 2;
    } else {
      outcome = "Lose";
    }
  } else if (betType === "3") {
    if (playerValue === bankerValue) {
      outcome = "Win";
      winnings = 8;
    } else {
      outcome = "Lose";
    }
  } else if (betType === "4") {
    if (isPair(playerHand)) {
      outcome = "Win";
      winnings = 11;
    } else {
      outcome = "Lose";
    }
  } else if (betType === "5") {
    if (isPair(bankerHand)) {
      outcome = "Win";
      winnings = 11;
    } else {
      outcome = "Lose";
    }
  } else {
    outcome = "Lose";
  }

  return { outcome, winnings };
}


/**
 * Initiates and manages a single session of Baccarat for the player.
 *
 * @example
 * // Assuming player object is already defined
 * await startGame(player);
 * // Engages player in a session of Baccarat, handling bets, card dealing, and outcomes.
 *
 * @param player The player participating in the game, represented as a Person object.
 *
 * @returns void. Continuously runs until the player decides to stop or runs out of funds.
 */
export async function startGame(player: Person): Promise<void> {
  // Starts the game by emptying the player's hand, creating a new deck suited
  // for Baccarat and creates a banker. 
  while(true) {
    player.hand = [];
    const deck = createBaccaratDeck();
    const banker: Person = { name: "Banker", password: "", 
                             balance: 0, hand: [] };

    // Prompts the player for their bet amount, 
    // displaying their current wallet balance.
    const prompt = "You have $" + player.balance + 
                  ". How much would you like to bet? ";
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

    // The final hand of the player and the banker
    const finalPlayerHand = await playerHand(deck, player);
    const finalBankerHand = await bankerHand(deck, banker, player);
    
    await showHand(player);
    await showHand(banker);

    console.log("Final value for player hand: " + finalPlayerHand);
    console.log("Final value for banker hand: " + finalBankerHand);

    const { outcome, winnings } = await decideOutcome(finalPlayerHand,
                                                      finalBankerHand, 
                                                      player.hand, 
                                                      banker.hand, 
                                                      userInput);
    // Manages potential winnings and losses.
    if (outcome === "Win") {
      console.log("You win");
      player.balance += Number(bet) * winnings;
    } else {
      console.log("You lose");
      player.balance -= Number(bet);
    }
    
    if (player.balance <= 0) {
      console.log("You've run out of funds! Game over.");
      break;
    } else {}

    const playAgainOptions = "Would you like to play again? Yes(1) or No(2): ";
    userInput = await readUserInput(playAgainOptions, 2);
    
    if (userInput === "1") {
      continue
    } else {break}
  }
}

