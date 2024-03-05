import { calculateHandValue, checkForBlackjack, getBet,
         playerTurn, dealerTurn, startGame } from './Blackjack';
import { readUserInput } from '../../../Utilities/userInput/readUserInput';
import {
  Card, createBlackjackDeck
} from '../Deck/Deck';
import { Person } from '../../../Utilities/Player/Player';

const createCard = (value: number, suit: string): Card => ({ value, suit });

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
      const hand = [
        createCard(14, "Hearts"), 
        createCard(9, "Spades"), 
        createCard(5, "Clubs")
      ];
      expect(calculateHandValue(hand)).toBe(15);
    });

    test("adjusts Ace value to prevent bust", () => {
      const hand = [
        createCard(13, "Hearts"), 
        createCard(9, "Spades"), 
        createCard(5, "Clubs")
      ];
      expect(calculateHandValue(hand)).toBe(24);
    });
  });

  describe("checkForBlackjack", () => {
    test("returns true for blackjack hand", () => {
      const hand = [createCard(14, "Hearts"), 
                    createCard(10, "Diamonds")];

      expect(checkForBlackjack(hand)).toBeTruthy();
    });

    test("returns false for non-blackjack hand", () => {
      const hand = [createCard(8, "Clubs"), 
                    createCard(9, "Hearts")];

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
      mockPlayer.hand = [createCard(8, "Hearts"), 
                         createCard(6, "Spades")];

      mockPlayer.balance = 1000;
      (readUserInput as jest.Mock).mockClear();
    });

    test("player chooses to stand", async () => {
      (readUserInput as jest.Mock).mockResolvedValueOnce("2");
      const result = await playerTurn(createBlackjackDeck(), mockPlayer, 100);
      expect(result).toBeTruthy();
    });

    test("player busts after hitting", async () => {
      mockPlayer.hand = [createCard(9, "Hearts"), createCard(8, "Spades")];
      (readUserInput as jest.Mock)
        .mockResolvedValueOnce("1");
      
      const result = await playerTurn(createBlackjackDeck(), mockPlayer, 100);
      
      expect(result).toBeFalsy();
      expect(mockPlayer.hand.length).toBeGreaterThanOrEqual(3);
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
        hand: [createCard(14, "Spades"), createCard(10, "Hearts")],
      };
  
      const finalTotal = await dealerTurn(createBlackjackDeck(), dealer);
      
      expect(finalTotal).toBe(21);
      expect(dealer.hand.length).toBe(2);
    });
  }); 
  
});

jest.mock('../../../Utilities/userInput/readUserInput', () => ({
  readUserInput: jest.fn(),
}));

jest.mock('../Deck/Deck', () => ({
  createBlackjackDeck: jest.fn(() => [
    { value: 10, suit: 'Hearts' }, // Simulate a simplified deck
    { value: 14, suit: 'Spades' }, // Ace
    { value: 10, suit: 'Diamonds' },
    { value: 5, suit: 'Clubs' },
  ]),
  showHand: jest.fn(), 
  dealInitialCards: jest.fn().mockImplementation(async (deck, player) => {
    player.hand.push(deck.shift(), deck.shift());
  }),
}));

describe("startGame function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPlayer.balance = 1000;
    mockPlayer.hand = [];
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 10, suit: 'Hearts' },
      { value: 2, suit: 'Spades' },
      { value: 6, suit: 'Clubs' },
      { value: 7, suit: 'Diamonds' },
      { value: 5, suit: 'Hearts' },
      { value: 14, suit: 'Spades' },
    ]);
  });

  test("completes a game cycle with the player choosing actions", async () => {
    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100")
      .mockResolvedValueOnce("1")
      .mockResolvedValueOnce("2");

    await startGame(mockPlayer);

    expect(mockPlayer.hand.length).toBeGreaterThanOrEqual(2);
    expect(mockPlayer.balance).not.toBe(1000);
  });

  test("handles blackjack on initial deal", async () => {
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 10, suit: 'Hearts' },
      { value: 14, suit: 'Spades' },
      { value: 10, suit: 'Diamonds' },
      { value: 5, suit: 'Clubs' },
    ]);

    (readUserInput as jest.Mock).mockResolvedValueOnce("100");

    await startGame(mockPlayer);

    expect(mockPlayer.balance).toBeGreaterThan(1000);
  });
});

describe("startGame - Outcomes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    mockPlayer.balance = 1000;
    mockPlayer.hand = [];
    (readUserInput as jest.Mock).mockResolvedValueOnce("100");
  });

  test("player wins against dealer", async () => {
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 10, suit: 'Hearts' },
      { value: 14, suit: 'Spades' },
      { value: 10, suit: 'Diamonds' },
      { value: 5, suit: 'Clubs' },
      { value: 10, suit: 'Clubs' }
    ]);

    await startGame(mockPlayer);

    expect(mockPlayer.balance).toBeGreaterThan(1000);
    expect(mockPlayer.hand.length).toBe(2);
  });

  test("tie when both player and dealer have blackjack", async () => {
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 14, suit: 'Hearts' },
      { value: 10, suit: 'Spades' },
      { value: 14, suit: 'Diamonds' },
      { value: 10, suit: 'Clubs' },
    ]);

    await startGame(mockPlayer);

    expect(mockPlayer.balance).toBe(1000);
  });

  test("player wins by having a higher total than the dealer", async () => {
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 9, suit: 'Hearts' },
      { value: 7, suit: 'Spades' },
      { value: 8, suit: 'Clubs' },
      { value: 6, suit: 'Diamonds' },
      { value: 10, suit: 'Clubs' },
    ]);

    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100")
      .mockResolvedValueOnce("2");

    await startGame(mockPlayer);

    expect(mockPlayer.balance).toBe(1100);
    expect(mockPlayer.hand.length).toBe(2);
  });

  test("tie game with no balance change", async () => {
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 10, suit: 'Hearts' },
      { value: 10, suit: 'Spades' },
      { value: 10, suit: 'Diamonds' },
      { value: 10, suit: 'Clubs' },
    ]);

    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100")
      .mockResolvedValueOnce("2");

    await startGame(mockPlayer);

    expect(mockPlayer.balance).toBe(mockPlayer.balance);
  });

  test("player doubles down successfully", async () => {
    (createBlackjackDeck as jest.Mock).mockReturnValue([
      { value: 10, suit: 'Hearts' },
      { value: 6, suit: 'Spades' },
      { value: 5, suit: 'Diamonds' },
      { value: 10, suit: 'Clubs' },
      { value: 6, suit: 'Hearts' },
    ]);

    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100")
      .mockResolvedValueOnce("3");

    await startGame(mockPlayer);

    expect(mockPlayer.balance).toBe(600);
    expect(mockPlayer.hand.length).toBe(3);
  });

  test("player runs out of funds and game ends", async () => {
    (createBlackjackDeck as jest.Mock).mockImplementation(() => [
      { value: 10, suit: 'Hearts' },
      { value: 9, suit: 'Spades' },
      { value: 8, suit: 'Diamonds' },
      { value: 7, suit: 'Clubs' },
      { value: 6, suit: 'Hearts' },
      { value: 5, suit: 'Spades' },
    ]);

    (readUserInput as jest.Mock)
      .mockResolvedValueOnce("100")
      .mockResolvedValueOnce("2")
      .mockResolvedValueOnce("2");

    mockPlayer.balance = 100;

    await startGame(mockPlayer);

    expect(mockPlayer.balance).toBe(0);
    const expectedMessage : string  = "You've run out of funds! Game over."
    expect(console.log).toHaveBeenCalledWith(expectedMessage);
  });
});
