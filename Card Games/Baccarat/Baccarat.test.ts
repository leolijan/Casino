import {
    calculateHandValue,
    playerHand,
    bankerHand,
    decideOutcome
  } from '../Baccarat/Baccarat'; 
  import { createBlackjackDeck, dealInitialCards} from '../Deck/Deck';
  import { createPerson } from '../../Player/Player';

  jest.mock('../../userInput/readUserInput', () => ({
    readUserInput: jest.fn().mockImplementation((prompt) => {
      if (prompt.includes("How much would you like to bet?")) return Promise.resolve('100');
      if (prompt.includes("Bet on Player hand")) return Promise.resolve('1');
      return Promise.resolve('1'); // Default response for other prompts
    })
  }));
  
  describe('Baccarat Game Tests', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('calculateHandValue', () => {
      test('correctly calculates the value of a hand without face cards', async () => {
        const hand = [{ value: 3, suit: 'Hearts' }, { value: 4, suit: 'Diamonds' }];
        const value = await calculateHandValue(hand);
        expect(value).toBe(7);
      });
    });
  
    describe('playerHand', () => {
      test('should add a card if player total is less than 6', async () => {
        const deck = [{ value: 2, suit: 'Clubs' }, { value: 3, suit: 'Spades' }]; 
        const player = { name: 'Player', password: '', balance: 1000, hand: [{ value: 2, suit: 'Hearts' }] };
        const total = await playerHand(deck, player);
        expect(player.hand.length).toBe(2);
        expect(total).toBeGreaterThanOrEqual(4); 
      });
    });
  
    describe('bankerHand', () => {
      test('should follow banker rules for drawing a third card', async () => {
        const deck = [{ value: 2, suit: 'Clubs' }, { value: 4, suit: 'Hearts' }]; 
        const banker = { name: 'Banker', password: '', balance: 0, hand: [{ value: 3, suit: 'Hearts' }] };
        const player = { name: 'Player', password: '', balance: 1000, hand: [{ value: 2, suit: 'Hearts' }, { value: 3, suit: 'Diamonds' }] };
        const total = await bankerHand(deck, banker, player);
        expect(banker.hand.length).toBe(2);
        expect(total).toBeLessThanOrEqual(9); 
      });
    });
  
    describe('decideOutcome', () => {
      test('decides player win correctly', async () => {
        const playerHand = [{ value: 3, suit: 'Hearts' }, { value: 4, suit: 'Diamonds' }];
        const bankerHand = [{ value: 2, suit: 'Hearts' }, { value: 3, suit: 'Clubs' }];
        const betType = "1"; // Bet on Player hand
        const result = await decideOutcome(7, 5, playerHand, bankerHand, betType);
        expect(result).toEqual({ outcome: 'Win', winnings: 2 });
      });
    });

    describe('calculateHandValue with multiple face cards', () => {
      test('correctly calculates the value of a hand with multiple face cards as 0', async () => {
        const hand = [{ value: 11, suit: 'Hearts' }, { value: 12, suit: 'Diamonds' }, { value: 13, suit: 'Clubs' }];
        const value = await calculateHandValue(hand);
        expect(value).toBe(0); // Face cards count as 0
      });
    });

    describe('calculateHandValue with aces and face cards', () => {
      test('correctly calculates the value of a hand with aces and face cards', async () => {
        const hand = [{ value: 14, suit: 'Hearts' }, { value: 11, suit: 'Diamonds' }, { value: 14, suit: 'Clubs' }];
        const value = await calculateHandValue(hand);
        expect(value).toBe(2); // Two aces as 1 each, face card as 0
      });
    });

    describe('calculateHandValue with all aces', () => {
      test('correctly calculates the value of a hand with all aces', async () => {
        const hand = [{ value: 14, suit: 'Hearts' }, { value: 14, suit: 'Diamonds' }];
        const value = await calculateHandValue(hand);
        expect(value).toBe(2); // Two aces counting as 1 each
      });
    });
        
    describe('decideOutcome for a tie game', () => {
      test('decides tie correctly', async () => {
        const playerHand = [{ value: 4, suit: 'Hearts' }, { value: 3, suit: 'Diamonds' }];
        const bankerHand = [{ value: 4, suit: 'Clubs' }, { value: 3, suit: 'Spades' }];
        const betType = "3"; // Bet on a tie
        const result = await decideOutcome(7, 7, playerHand, bankerHand, betType);
        expect(result).toEqual({ outcome: 'Win', winnings: 8 });
      });
    });
    
    describe('decideOutcome with player betting on banker and banker wins', () => {
      test('correctly decides banker win when player bets on banker', async () => {
        const playerHand = [{ value: 2, suit: 'Hearts' }, { value: 2, suit: 'Diamonds' }];
        const bankerHand = [{ value: 3, suit: 'Clubs' }, { value: 4, suit: 'Spades' }];
        const betType = "2"; // Bet on Banker hand
        const result = await decideOutcome(4, 7, playerHand, bankerHand, betType);
        expect(result).toEqual({ outcome: 'Win', winnings: 1.95 }); // Banker wins, player bet on banker
      });
    });
    
    describe('decideOutcome when bet does not match outcome', () => {
      test('player loses when betting on player but banker wins', async () => {
        // Adjusting card values to more clearly reflect Baccarat rules
        const playerHand = [{ value: 2, suit: 'Hearts' }, { value: 4, suit: 'Diamonds' }]; // Player total = 6
        const bankerHand = [{ value: 9, suit: 'Clubs' }, { value: 0, suit: 'Spades' }]; // Banker total = 9
        const betType = "1"; // Bet on Player hand
        const playerValue = 6; // Sum of player's hand modulo 10
        const bankerValue = 9; // Sum of banker's hand modulo 10, closer to 9 than player
    
        const result = await decideOutcome(playerValue, bankerValue, playerHand, bankerHand, betType);
        expect(result).toEqual({ outcome: 'Lose', winnings: 0 }); // Player bet on player, but banker wins
      });
    });

    describe('playerHand with total of 6 or more', () => {
      test('does not add a card if player total is 6 or more', async () => {
        const deck = createBlackjackDeck(); // Assuming this creates a full deck
        const player = { name: 'Player', password: '', balance: 1000, hand: [{ value: 4, suit: 'Hearts' }, { value: 2, suit: 'Diamonds' }] };
        const total = await playerHand(deck, player);
        expect(player.hand.length).toBe(2); // No new card added
        expect(total).toBe(6);
      });
    });

    describe('bankerHand draws on total of 5 or less', () => {
      test('banker draws a third card if total is 5 or less', async () => {
        const deck = createBlackjackDeck(); // Assuming this creates a full deck
        const banker = { name: 'Banker', password: '', balance: 0, hand: [{ value: 2, suit: 'Hearts' }, { value: 3, suit: 'Diamonds' }] };
        const player = { name: 'Player', password: '', balance: 1000, hand: [] }; // Player hand irrelevant in this test
        const total = await bankerHand(deck, banker, player);
        expect(banker.hand.length).toBe(3); // Expecting a third card to be drawn
      });
    });

    describe('decideOutcome on a tie bet', () => {
      test('player loses when betting on a tie but no tie occurs', async () => {
        const result = await decideOutcome(6, 7, [], [], "3"); // Bet type 3 for tie
        expect(result).toEqual({ outcome: 'Lose', winnings: 0 });
      });
    });
    
    describe('decideOutcome with player pair bet', () => {
      test('wins correctly when player has a pair', async () => {
        const playerHand = [{ value: 2, suit: 'Hearts' }, { value: 2, suit: 'Diamonds' }];
        const result = await decideOutcome(0, 0, playerHand, [], "4"); // Bet type 4 for player pair
        expect(result).toEqual({ outcome: 'Win', winnings: 11 });
      });
    });
    
    describe('decideOutcome with banker pair bet and no pair', () => {
      test('player loses when betting on banker pair but no pair occurs', async () => {
        const bankerHand = [{ value: 3, suit: 'Clubs' }, { value: 4, suit: 'Spades' }];
        const result = await decideOutcome(0, 0, [], bankerHand, "5"); // Bet type 5 for banker pair
        expect(result).toEqual({ outcome: 'Lose', winnings: 0 });
      });
    });
    
  });
  
  