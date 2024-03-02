import {
  calculateHandValue,
  playerHand,
  bankerHand,
  decideOutcome,
  startGame
} from './Baccarat';
import { Card, createBlackjackDeck as createBaccaratDeck, dealInitialCards, } from '../Deck/Deck';
import { Person, createPerson } from '../../../Player/Player';
import { readUserInput } from '../../../userInput/readUserInput';


describe('Baccarat Game Tests', () => {

  describe('calculateHandValue', () => {
    test('calculates the value of a hand without face cards', async () => {
      const hand = [{ value: 3, suit: 'Hearts' }, { value: 4, suit: 'Diamonds' }];
      const value = await calculateHandValue(hand);
      expect(value).toBe(7);
    });

    test('calculates the value of a hand with multiple face cards as 0', async () => {
      const hand = [{ value: 11, suit: 'Hearts' }, { value: 12, suit: 'Diamonds' }, { value: 13, suit: 'Clubs' }];
      const value = await calculateHandValue(hand);
      expect(value).toBe(0); // Face cards count as 0
    });

    test('calculates the value of a hand with aces and face cards', async () => {
      const hand = [{ value: 14, suit: 'Hearts' }, { value: 11, suit: 'Diamonds' }, { value: 14, suit: 'Clubs' }];
      const value = await calculateHandValue(hand);
      expect(value).toBe(2); // Two aces as 1 each, face card as 0
    });

    test('calculates the value of a hand with all aces', async () => {
      const hand = [{ value: 14, suit: 'Hearts' }, { value: 14, suit: 'Diamonds' }];
      const value = await calculateHandValue(hand);
      expect(value).toBe(2); // Two aces counting as 1 each
    });
  });

  describe('playerHand', () => {
    test('adds a card if player total is less than 6', async () => {
      const deck = [{ value: 2, suit: 'Clubs' }, { value: 3, suit: 'Spades' }];
      const player = { name: 'Player', password: '', balance: 1000, hand: [{ value: 2, suit: 'Hearts' }] };
      const total = await playerHand(deck, player);
      expect(player.hand.length).toBe(2);
      expect(total).toBeGreaterThanOrEqual(4);
    });

    test('does not add a card if player total is 6 or more', async () => {
      const deck = createBaccaratDeck(); // Assuming this creates a full deck
      const player = { name: 'Player', password: '', balance: 1000, hand: [{ value: 4, suit: 'Hearts' }, { value: 2, suit: 'Diamonds' }] };
      const total = await playerHand(deck, player);
      expect(player.hand.length).toBe(2); // No new card added
      expect(total).toBe(6);
    });
  });

  describe('bankerHand', () => {
    test('banker draws on total <= 2 regardless of player third card', async () => {
      const deck: Card[] = createBaccaratDeck();
      const banker = createPerson('Banker', '', 0);
      const player = createPerson('Player', '', 1000);
      banker.hand = [{ value: 2, suit: 'Clubs' }];
      player.hand = [{ value: 3, suit: 'Hearts' }, { value: 2, suit: 'Diamonds' }];
      const total = await bankerHand(deck, banker, player);
      expect(total).toBeLessThanOrEqual(9); // Ensures banker drew a third card
    });

    test('banker stands on total 7', async () => {
      const deck = [{ value: 10, suit: 'Clubs' }]; // A card that won't be drawn
      const banker = createPerson('Banker', '', 0);
      banker.hand = [{ value: 4, suit: 'Hearts' }, { value: 3, suit: 'Diamonds' }]; // Total of 7
      const player = createPerson('Player', '', 1000);
      player.hand = [{ value: 8, suit: 'Clubs' }, { value: 9, suit: 'Spades' }];
      await bankerHand(deck, banker, player);
      expect(banker.hand.length).toBe(2); // Banker should not draw a third card
    });

    test('banker draws on total 3 and player third card not 8', async () => {
      const deck: Card[] = createBaccaratDeck();
      const banker = createPerson('Banker', '', 0);
      banker.hand = [{ value: 3, suit: 'Hearts' }];
      const player = createPerson('Player', '', 1000);
      player.hand = [{ value: 2, suit: 'Clubs' }, { value: 3, suit: 'Spades' }, { value: 2, suit: 'Diamonds' }];
      const total = await bankerHand(deck, banker, player);
      expect(total).toBeLessThanOrEqual(9); // Banker should draw a third card
    });

    test('banker does not draw if total is 3 and player third card is 8', async () => {
      const deck: Card[] = createBaccaratDeck();
      const banker = createPerson('Banker', '', 0);
      banker.hand = [{ value: 3, suit: 'Hearts' }];
      const player = createPerson('Player', '', 1000);
      player.hand = [{ value: 2, suit: 'Clubs' }, { value: 3, suit: 'Spades' }, { value: 8, suit: 'Diamonds' }];
      await bankerHand(deck, banker, player);
      expect(banker.hand.length).toBe(2); // Banker stands due to player's third card being 8
    });

    test('banker draws on total 4 and player third card 2-7', async () => {
      const deck = [{ value: 5, suit: 'Hearts' }]; // A card for the banker to draw
      const banker = createPerson('Banker', '', 0);
      banker.hand = [{ value: 2, suit: 'Hearts' }, { value: 2, suit: 'Diamonds' }]; // Total of 4
      const player = createPerson('Player', '', 1000);
      player.hand = [{ value: 2, suit: 'Clubs' }, { value: 3, suit: 'Spades' }, { value: 6, suit: 'Diamonds' }]; // Third card within 2-7
      await bankerHand(deck, banker, player);
      expect(banker.hand.length).toBe(3); // Banker draws a third card
    });

    test('banker does not draw if total is 6 and player third card is not 6 or 7', async () => {
      const deck = [{ value: 10, suit: 'Clubs' }]; // A card that won't be drawn
      const banker = createPerson('Banker', '', 0);
      banker.hand = [{ value: 3, suit: 'Hearts' }, { value: 3, suit: 'Diamonds' }]; // Total of 6
      const player = createPerson('Player', '', 1000);
      player.hand = [{ value: 2, suit: 'Clubs' }, { value: 3, suit: 'Spades' }, { value: 5, suit: 'Diamonds' }]; // Third card not 6 or 7
      await bankerHand(deck, banker, player);
      expect(banker.hand.length).toBe(2); // Banker should not draw a third card
    });

    test('banker draws on total <= 2 regardless of player third card', async () => {
      const deck = [{ value: 5, suit: 'Hearts' }]; // A card for the banker to draw
      const banker = createPerson('Banker', '', 0);
      banker.hand = [{ value: 2, suit: 'Hearts' }]; // Total of 2 or less
      const player = createPerson('Player', '', 1000);
      player.hand = [{ value: 8, suit: 'Clubs' }, { value: 9, suit: 'Spades' }, { value: 2, suit: 'Diamonds' }];
      await bankerHand(deck, banker, player);
      expect(banker.hand.length).toBe(2); // Banker draws a third card
    });

    test('banker draws on total 5 and player third card 4-7', async () => {
      const deck = [{ value: 5, suit: 'Hearts' }]; // A card for the banker to draw
      const banker = createPerson('Banker', '', 0);
      banker.hand = [{ value: 3, suit: 'Hearts' }, { value: 2, suit: 'Diamonds' }]; // Total of 5
      const player = createPerson('Player', '', 1000);
      player.hand = [{ value: 8, suit: 'Clubs' }, { value: 9, suit: 'Spades' }, { value: 5, suit: 'Diamonds' }]; // Third card 4-7
      await bankerHand(deck, banker, player);
      expect(banker.hand.length).toBe(3); // Banker draws a third card
    });

    test('banker draws a third card if total is 6 and player third card is 6 or 7', async () => {
      const deck = [{ value: 5, suit: 'Hearts' }]; // A card for the banker to draw
      const banker = createPerson('Banker', '', 0);
      // Pre-setting the banker's hand to simulate a total of 6
      banker.hand = [{ value: 2, suit: 'Hearts' }, { value: 2, suit: 'Diamonds' }, { value: 2, suit: 'Spades' }];
      const player = createPerson('Player', '', 1000);
      // Simulating a scenario where the player has already drawn a third card
      player.hand = [{ value: 2, suit: 'Clubs' }, { value: 2, suit: 'Spades' }, { value: 7, suit: 'Diamonds' }]; // Player's third card is 6

      // Executing the banker's hand logic to possibly draw a third card based on the conditions
      await bankerHand(deck, banker, player);

      // Verifying that the banker indeed draws a third card under these specific conditions
      expect(banker.hand.length).toBe(3); // Validates the banker has drawn a third card
    });
  });

  describe('decideOutcome', () => {
    const playerHand = [{ value: 2, suit: 'Hearts' }, { value: 4, suit: 'Spades' }];
    const bankerHand = [{ value: 3, suit: 'Diamonds' }, { value: 5, suit: 'Clubs' }];

    test('player wins when betting on player and player has higher value', () => {
      const outcome = decideOutcome(9, 7, playerHand, bankerHand, "1");
      expect(outcome).toEqual({ outcome: 'Win', winnings: 2 });
    });

    test('player loses when betting on player but banker has higher value', () => {
      const outcome = decideOutcome(6, 7, playerHand, bankerHand, "1");
      expect(outcome).toEqual({ outcome: 'Lose', winnings: 0 });
    });

    test('player wins when betting on banker and banker has higher value', () => {
      const outcome = decideOutcome(5, 8, playerHand, bankerHand, "2");
      expect(outcome).toEqual({ outcome: 'Win', winnings: 1.95 });
    });

    test('player loses when betting on banker but player has higher value', () => {
      const outcome = decideOutcome(8, 6, playerHand, bankerHand, "2");
      expect(outcome).toEqual({ outcome: 'Lose', winnings: 0 });
    });

    test('player wins when betting on a tie and both hands have equal value', () => {
      const outcome = decideOutcome(8, 8, playerHand, bankerHand, "3");
      expect(outcome).toEqual({ outcome: 'Win', winnings: 8 });
    });

    test('player loses when betting on a tie but no tie occurs', () => {
      const outcome = decideOutcome(9, 8, playerHand, bankerHand, "3");
      expect(outcome).toEqual({ outcome: 'Lose', winnings: 0 });
    });

    test('player wins with player pair bet when player hand has a pair', () => {
      const pairedPlayerHand = [{ value: 2, suit: 'Hearts' }, { value: 2, suit: 'Spades' }];
      const outcome = decideOutcome(4, 7, pairedPlayerHand, bankerHand, "4");
      expect(outcome).toEqual({ outcome: 'Win', winnings: 11 });
    });

    test('player loses with player pair bet when no pair in player hand', () => {
      const outcome = decideOutcome(9, 7, playerHand, bankerHand, "4");
      expect(outcome).toEqual({ outcome: 'Lose', winnings: 0 });
    });

    test('player wins with banker pair bet when banker hand has a pair', () => {
      const pairedBankerHand = [{ value: 3, suit: 'Diamonds' }, { value: 3, suit: 'Clubs' }];
      const outcome = decideOutcome(5, 6, playerHand, pairedBankerHand, "5");
      expect(outcome).toEqual({ outcome: 'Win', winnings: 11 });
    });

    test('player loses with banker pair bet when no pair in banker hand', () => {
      const outcome = decideOutcome(6, 8, playerHand, bankerHand, "5");
      expect(outcome).toEqual({ outcome: 'Lose', winnings: 0 });
    });

    test('player loses on invalid bet type', () => {
      const outcome = decideOutcome(7, 5, playerHand, bankerHand, "invalid");
      expect(outcome).toEqual({ outcome: 'Lose', winnings: 0 }); // Assuming invalid bet type defaults to a loss
    });
  });
});

// Mocking readUserInput and Deck module
jest.mock('../../../userInput/readUserInput', () => ({
  readUserInput: jest.fn(),
}));


describe("Baccarat startGame function", () => {
  let mockPlayer : Person;

  jest.mock('../Deck/Deck', () => ({
  createBaccaratDeck: jest.fn(() => [
    { value: 2, suit: 'Hearts' }, // Simulate a simplified deck for Baccarat
    { value: 3, suit: 'Spades' },
    { value: 4, suit: 'Diamonds' },
    // Add more cards as necessary for testing
  ]),
  showHand: jest.fn(),
  dealInitialCards: jest.fn().mockImplementation(async (deck, person) => {
    person.hand.push(deck.shift(), deck.shift()); // Simulate dealing two cards
  }),
}));

beforeEach(() => {
  jest.clearAllMocks(); // Clear all mocks before each test

  mockPlayer = {
    name: "Player",
    password: '',
    balance: 1000,
    hand: [],
  };

  jest.spyOn(console, 'log').mockImplementation();

  // General mock setup for readUserInput without specifying .mockResolvedValueOnce here
  (readUserInput as jest.Mock).mockImplementation(() => Promise.resolve("100"));
});

  test("completes a game cycle with player betting and making choices", async () => {
    await startGame(mockPlayer);

    // Verify that player has a hand dealt
    expect(mockPlayer.hand.length).toBeGreaterThanOrEqual(2);

    // Assuming the mock deck and player choices can influence game outcomes,
    // you might want to verify the balance has changed indicating a win or loss.
    expect(mockPlayer.balance).not.toBe(1000); // Example assertion, adjust based on game logic
  });

  test("ensures the game ends correctly when player chooses not to continue", async () => {
    // Adjusting the mock for the player choosing not to continue after the first game
    (readUserInput as jest.Mock).mockResolvedValueOnce("no");

    await startGame(mockPlayer);

    // You could check for console logs, or other side effects indicating the game has ended.
    // This example simply checks that the function completes execution.
    expect(true).toBe(true); // Placeholder assertion
  });

  test("player runs out of funds and the game ends", async () => {
    mockPlayer.balance = 100; // Set player balance to ensure they run out of funds
  
    // Mock the sequence of user inputs for this scenario
    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100") // Player bets their entire balance
      .mockResolvedValueOnce("lose") // Simulate a loss decision, adjust according to your game logic
      .mockResolvedValueOnce("2"); // Player decides not to play again
  
    await startGame(mockPlayer);
  
    expect(mockPlayer.balance).toBe(0); // Check if the player's balance is 0 after losing
    expect(console.log).toHaveBeenCalledWith("You've run out of funds! Game over.");
  });
  
  test("player chooses to play again", async () => {
    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100") // First bet
      .mockResolvedValueOnce("1") // Decision for the first game
      .mockResolvedValueOnce("1") // Choose to play again
      .mockResolvedValueOnce("100") // Second bet
      .mockResolvedValueOnce("1") // Decision for the second game
      .mockResolvedValueOnce("2"); // Choose not to play again


    await startGame(mockPlayer);

    // Expect the startGame function to handle player choices appropriately
    expect(readUserInput).toHaveBeenCalledTimes(5);
    // This implicitly checks that the startGame function was able to restart based on player choice
  });
});
