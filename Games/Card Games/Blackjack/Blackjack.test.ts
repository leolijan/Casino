// Blackjack.test.ts
import { calculateHandValue, checkForBlackjack, getBet, playerTurn, dealerTurn, startGame} from './Blackjack';
import { readUserInput } from '../../../userInput/readUserInput';
import { Card, createBlackjackDeck, showHand , dealInitialCards} from '../Deck/Deck';
import { Person } from '../../../Player/Player';



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

    test("adjusts Ace value to prevent bust", () => {
      const hand = [createCard(13, "Hearts"), createCard(9, "Spades"), createCard(5, "Clubs")];
      expect(calculateHandValue(hand)).toBe(24);
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

    test("player doubles down successfully", async () => {
      mockPlayer.hand = [createCard(9, "Hearts"), createCard(2, "Spades")]; // Pre-setup for doubling down
      (readUserInput as jest.Mock)
        .mockResolvedValueOnce("3"); // Simulate player choosing to double down
      
      const initialBalance = mockPlayer.balance;
      const result = await playerTurn(createBlackjackDeck(), mockPlayer, 100);
      
      expect(result).toBe(true); // Assuming doubling down ends player's turn 
      // Assuming initialBalance was defined earlier in the test
      expect(mockPlayer.balance).toBe(initialBalance - 100 * 2); // Assuming bet was doubled
      expect(mockPlayer.hand.length).toBe(3); // Player receives exactly one additional card

    });
  
    test("player busts after hitting", async () => {
      mockPlayer.hand = [createCard(9, "Hearts"), createCard(8, "Spades")]; // Setup for potential bust
      (readUserInput as jest.Mock)
        .mockResolvedValueOnce("1"); // Simulate player choosing to hit
      
      const result = await playerTurn(createBlackjackDeck(), mockPlayer, 100);
      
      expect(result).toBeFalsy(); // Player's turn ends after busting
      expect(mockPlayer.hand.length).toBeGreaterThanOrEqual(3); // Player has at least 3 cards after busting
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

    test("dealer has blackjack", async () => {
      const dealer = {
        name: "Dealer",
        password: "dealerPass",
        balance: 0,
        hand: [createCard(14, "Spades"), createCard(10, "Hearts")], // Setup for blackjack
      };
  
      const finalTotal = await dealerTurn(createBlackjackDeck(), dealer);
      
      expect(finalTotal).toBe(21); // Dealer's final hand value is blackjack
      expect(dealer.hand.length).toBe(2); // Dealer starts and ends with 2 cards (blackjack)
    });
  }); 
  
});

// Continue from the previously provided mocks and setup...

// Mocking readUserInput and Deck module
jest.mock('../../../userInput/readUserInput', () => ({
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

describe("startGame function", () => {
  // Setup a mock player with an initial balance and an empty hand
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
  
    expect(mockPlayer.hand.length).toBeGreaterThanOrEqual(2); // Ensures at least two cards are dealt
    expect(mockPlayer.balance).not.toBe(1000); // Check if balance changed indicating game outcome
  });

  // Further tests for different scenarios (e.g., busts, dealer wins) can follow the same structure
});



describe("startGame - Outcomes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    mockPlayer.balance = 1000;
    mockPlayer.hand = [];
    (readUserInput as jest.Mock).mockResolvedValueOnce("100"); // Simulate valid bet amount
  });

  test("player wins against dealer", async () => {
    // Setup for player win scenario
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 10, suit: 'Hearts' },  // Player's card
      { value: 14, suit: 'Spades' }, // Player's card, Ace for blackjack
      { value: 10, suit: 'Diamonds' }, // Dealer's card
      { value: 5, suit: 'Clubs' },     // Dealer's card
      { value: 10, suit: 'Clubs' }     // Dealer's card, ensuring dealer does not have blackjack and does not beat player
    ]);

    await startGame(mockPlayer);

    expect(mockPlayer.balance).toBeGreaterThan(1000); // Verify balance increase from winning
    expect(mockPlayer.hand.length).toBe(2); // Player should have 2 cards (blackjack)
  });

  test("tie when both player and dealer have blackjack", async () => {
    // Adjust mock deck for tie scenario
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 14, suit: 'Hearts' }, // Player's Ace
      { value: 10, suit: 'Spades' }, // Player's 10
      { value: 14, suit: 'Diamonds' }, // Dealer's Ace
      { value: 10, suit: 'Clubs' }, // Dealer's 10 for blackjack
    ]);

    await startGame(mockPlayer);

    expect(mockPlayer.balance).toBe(1000); // Balance remains unchanged in a tie
  });

  test("player wins by having a higher total than the dealer", async () => {
    // Mocking deck to simulate specific cards being drawn
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 9, suit: 'Hearts' }, // Player's first card
      { value: 7, suit: 'Spades' }, // Dealer's first card
      { value: 8, suit: 'Clubs' },  // Player's second card, leading to a total of 17
      { value: 6, suit: 'Diamonds' }, // Dealer's second card, dealer total of 13
      { value: 10, suit: 'Clubs' }, // Dealer's third card, causing dealer to bust
      // Adding more cards if needed for further actions
    ]);
  
    // Mock user input for betting 100 and choosing to stand (not taking additional cards)
    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100") // Bet amount
      .mockResolvedValueOnce("2"); // Player chooses to stand after initial deal
  
    const initialBalance = mockPlayer.balance; // Saving initial balance for comparison
  
    await startGame(mockPlayer);
  
    // Expectations
    expect(mockPlayer.balance).toBeGreaterThan(initialBalance); // Player wins, balance should increase
    expect(mockPlayer.hand.length).toBe(2); // Player has exactly two cards, since they chose to stand
    // Verifying dealer took an extra card and busted, or ended with a lower total than player
  });

  test("tie game with no balance change", async () => {
    // Mock deck to ensure a tie
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 10, suit: 'Hearts' }, // Player's card
      { value: 10, suit: 'Spades' }, // Dealer's card
      { value: 10, suit: 'Diamonds' }, // Player's card
      { value: 10, suit: 'Clubs' }    // Dealer's card
    ]);

    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100") // Bet amount
      .mockResolvedValueOnce("2");  // Player chooses to stand

    const initialBalance = mockPlayer.balance;
    await startGame(mockPlayer);

    // Expect no change in balance due to the tie
    expect(mockPlayer.balance).toBe(initialBalance);
    // Optionally, verify that a tie was acknowledged in the game output
  });
  
  test("player doubles down successfully", async () => {
    // Mocking the initial cards and the card received upon doubling down
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 10, suit: 'Hearts' }, // Player's first card
      { value: 6, suit: 'Spades' },  // Dealer's first card
      { value: 5, suit: 'Diamonds' }, // Player's second card
      { value: 10, suit: 'Clubs' },   // Dealer's second card
      { value: 6, suit: 'Hearts' }    // Player's card received upon doubling down
    ]);

    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100") // Bet amount
      .mockResolvedValueOnce("3");  // Player chooses to double down

    const initialBalance = mockPlayer.balance;
    await startGame(mockPlayer);

    // Verify player's balance is deducted correctly for the doubled bet
    expect(mockPlayer.balance).toBe(initialBalance - 200); // Initial bet was 100, doubled down so an additional 100 is bet
    expect(mockPlayer.hand.length).toBe(3); // Verify player received one more card upon doubling down
  });

  test("player runs out of funds and game ends", async () => {
    // Mocking the deck to simulate a loss scenario repeatedly
    (createBlackjackDeck as jest.Mock).mockImplementation(() => [
      { value: 10, suit: 'Hearts' },  // High cards for dealer to win
      { value: 9, suit: 'Spades' },
      { value: 8, suit: 'Diamonds' },
      { value: 7, suit: 'Clubs' },
      { value: 6, suit: 'Hearts' },
      { value: 5, suit: 'Spades' },
    ]);

    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100") // Bet amount that will cause the player to run out of funds after one game
      .mockResolvedValueOnce("2")   // Player chooses to stand
      .mockResolvedValueOnce("2");  // Assumes player chooses not to play again if given the option

    mockPlayer.balance = 100; // Set player balance low to simulate running out of funds quickly

    await startGame(mockPlayer);

    // Verify the game ends when the player runs out of funds
    expect(mockPlayer.balance).toBe(0); // Player has lost their bet and run out of funds
    expect(console.log).toHaveBeenCalledWith("You've run out of funds! Game over."); // Checks if the specific message is logged
  });
});
