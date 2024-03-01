// Blackjack.test.ts
import { calculateHandValue, checkForBlackjack, getBet, playerTurn, dealerTurn, startGame} from '../Blackjack/Blackjack';
import { readUserInput } from '../../userInput/readUserInput';
import { Card, createBlackjackDeck, showHand , dealInitialCards} from '../Deck/Deck';
import { Person } from '../../Player/Player';

// Mocking readUserInput and Deck module
jest.mock('../../userInput/readUserInput', () => ({
  readUserInput: jest.fn(),
}));

// Adjusting the jest.mock('../Deck/Deck') call to include dealInitialCards
jest.mock('../Deck/Deck', () => ({
  createBlackjackDeck: jest.fn(() => [
    { value: 10, suit: 'Hearts' }, // Simulate a simplified deck
    { value: 14, suit: 'Spades' }, // Ace
    { value: 10, suit: 'Diamonds' },
    { value: 5, suit: 'Clubs' },
  ]),
  showHand: jest.fn(), // Assuming this was already mocked
  dealInitialCards: jest.fn().mockImplementation(async (deck, player) => {
    // Simulate dealing cards to a player and a dealer from the deck
    player.hand.push(deck.shift(), deck.shift()); // Simulate dealing two cards to the player
  }),
}));

// Utility function to create Card objects
const createCard = (value: number, suit: string): Card => ({ value, suit });

// Setting up a mock player according to the Person type
const mockPlayer: Person = {
  name: "Test Player",
  password: "dummyPassword",
  balance: 1000,
  hand: [],
};

describe("Blackjack Functionality", () => {
  describe("calculateHandValue", () => {
    test("correctly calculates hand value without Aces", () => {
      const hand = [createCard(2, "Hearts"), createCard(10, "Spades")];
      expect(calculateHandValue(hand)).toBe(12);
    });

    test("adjusts Ace value to prevent bust", () => {
      const hand = [createCard(14, "Hearts"), createCard(9, "Spades"), createCard(5, "Clubs")];
      expect(calculateHandValue(hand)).toBe(15);
    });
  });

  describe("checkForBlackjack", () => {
    test("returns true for blackjack hand", () => {
      const hand = [createCard(14, "Hearts"), createCard(10, "Diamonds")];
      expect(checkForBlackjack(hand)).toBeTruthy();
    });

    test("returns false for non-blackjack hand", () => {
      const hand = [createCard(8, "Clubs"), createCard(9, "Hearts")];
      expect(checkForBlackjack(hand)).toBeFalsy();
    });
  });

  describe("getBet", () => {
    beforeEach(() => {
      (readUserInput as jest.Mock).mockClear();
    });

    test("prompts for and returns a valid bet amount", async () => {
      (readUserInput as jest.Mock).mockResolvedValueOnce("100");
      const bet = await getBet(mockPlayer);
      expect(bet).toBe(100);
      expect(readUserInput).toHaveBeenCalled();
    });
  });
});

describe("Blackjack Game Mechanics", () => {
  describe("playerTurn", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockPlayer.hand = [createCard(8, "Hearts"), createCard(6, "Spades")];
      (readUserInput as jest.Mock).mockClear();
    });

    test("player chooses to stand", async () => {
      (readUserInput as jest.Mock).mockResolvedValueOnce("2"); // Simulate player choosing to stand
      const result = await playerTurn(createBlackjackDeck(), mockPlayer, 100);
      // Replace this with your actual logic check
      expect(result).toBeTruthy();
    });
  });

  describe("dealerTurn", () => {
    test("dealer draws cards until reaching 17 or higher", async () => {
      const dealer: Person = {
        name: "Dealer",
        password: "dealerPass",
        balance: 0,
        hand: [createCard(4, "Diamonds")],
      };
      const finalTotal = await dealerTurn(createBlackjackDeck(), dealer);
      expect(finalTotal).toBeGreaterThanOrEqual(17);
      expect(dealer.hand.length).toBeGreaterThan(1);
    });
  }); 
});

// Continue from the previously provided mocks and setup...

describe("startGame function", () => {
  // Setup a mock player with an initial balance and an empty hand
  const mockPlayer: Person = {
    name: "Test Player",
    password: "dummyPassword",
    balance: 1000,
    hand: [],
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test

    // Reset mock player's state before each test for a clean start
    mockPlayer.balance = 1000;
    mockPlayer.hand = [];

    // Mock a deck with a predefined set of cards for consistent test results
    // This setup ensures enough cards for initial dealing and at least one round of player actions
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 10, suit: 'Hearts' },
      { value: 2, suit: 'Spades' },
      { value: 6, suit: 'Clubs' },
      { value: 7, suit: 'Diamonds' },
      { value: 5, suit: 'Hearts' }, // Additional cards for player actions
      { value: 14, suit: 'Spades' }, // Ace, in case of hit action
      // Add more cards as needed based on your test scenarios
    ]);
  });

  test("completes a game cycle with the player choosing actions", async () => {
    // Ensure `readUserInput` for bet amount is within player balance and simulate player actions
    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100") // Valid bet amount
      .mockResolvedValueOnce("1") // Player chooses to hit
      .mockResolvedValueOnce("2"); // Player chooses to stand

    await startGame(mockPlayer);

    // Assertions to verify the game proceeded as expected
    expect(readUserInput).toHaveBeenCalledTimes(3); // Called for bet, hit, and stand
    expect(mockPlayer.hand.length).toBeGreaterThanOrEqual(2); // Player has at least two cards
    expect(mockPlayer.balance).not.toBe(1000); // Assuming balance changes due to game outcome
  });

  test("handles blackjack on initial deal", async () => {
    // Adjust mock deck to ensure player gets a blackjack
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 10, suit: 'Hearts' },  // Player's card
      { value: 14, suit: 'Spades' }, // Player's card, Ace for blackjack
      { value: 10, suit: 'Diamonds' }, // Dealer's card
      { value: 5, suit: 'Clubs' },     // Dealer's card
    ]);

    // Mock `readUserInput` to only need to handle the bet input
    (readUserInput as jest.Mock).mockResolvedValueOnce("100");

    await startGame(mockPlayer);

    // Assuming specific payout logic for blackjack, adjust accordingly
    expect(mockPlayer.balance).toBeGreaterThan(1000); // Verify balance increase from winning
  });
  
  test("completes a game cycle with the player choosing actions", async () => {
    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100") // Simulate valid bet amount
      .mockResolvedValueOnce("1") // Simulate choosing to hit
      .mockResolvedValueOnce("2"); // Simulate choosing to stand
  
    await startGame(mockPlayer);
  
    // Assertions to verify the game proceeded as expected
    expect(readUserInput).toHaveBeenCalledTimes(3);
    expect(mockPlayer.hand.length).toBeGreaterThanOrEqual(2); // Ensures at least two cards are dealt
    expect(mockPlayer.balance).not.toBe(1000); // Check if balance changed indicating game outcome
  });

  // Further tests for different scenarios (e.g., busts, dealer wins) can follow the same structure
});



