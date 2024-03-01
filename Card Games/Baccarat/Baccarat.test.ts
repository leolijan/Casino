import {
    calculateHandValue,
    playerHand,
    bankerHand,
    decideOutcome
  } from '../Baccarat/Baccarat'; 
  import { Card, createBlackjackDeck, dealInitialCards, } from '../Deck/Deck';
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
        const deck = createBlackjackDeck(); // Assuming this creates a full deck
        const player = { name: 'Player', password: '', balance: 1000, hand: [{ value: 4, suit: 'Hearts' }, { value: 2, suit: 'Diamonds' }] };
        const total = await playerHand(deck, player);
        expect(player.hand.length).toBe(2); // No new card added
        expect(total).toBe(6);
      });
    });
  
    describe('bankerHand', () => {
      test('follows banker rules for drawing a third card', async () => {
        const deck = [{ value: 2, suit: 'Clubs' }, { value: 4, suit: 'Hearts' }]; 
        const banker = { name: 'Banker', password: '', balance: 0, hand: [{ value: 3, suit: 'Hearts' }] };
        const player = { name: 'Player', password: '', balance: 1000, hand: [{ value: 2, suit: 'Hearts' }, { value: 3, suit: 'Diamonds' }] };
        const total = await bankerHand(deck, banker, player);
        expect(banker.hand.length).toBe(2);
        expect(total).toBeLessThanOrEqual(9); 
      });
  
      test('banker draws a third card if total is 5 or less', async () => {
        const deck = createBlackjackDeck(); // Assuming this creates a full deck
        const banker = { name: 'Banker', password: '', balance: 0, hand: [{ value: 2, suit: 'Hearts' }, { value: 3, suit: 'Diamonds' }] };
        const player = { name: 'Player', password: '', balance: 1000, hand: [] }; // Player hand irrelevant in this test
        const total = await bankerHand(deck, banker, player);
        expect(banker.hand.length).toBe(3); // Expecting a third card to be drawn
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
  
      test('decides tie correctly', async () => {
        const playerHand = [{ value: 4, suit: 'Hearts' }, { value: 3, suit: 'Diamonds' }];
        const bankerHand = [{ value: 4, suit: 'Clubs' }, { value: 3, suit: 'Spades' }];
        const betType = "3"; // Bet on a tie
        const result = await decideOutcome(7, 7, playerHand, bankerHand, betType);
        expect(result).toEqual({ outcome: 'Win', winnings: 8 });
      });
  
      test('correctly decides banker win when player bets on banker', async () => {
        const playerHand = [{ value: 2, suit: 'Hearts' }, { value: 2, suit: 'Diamonds' }];
        const bankerHand = [{ value: 3, suit: 'Clubs' }, { value: 4, suit: 'Spades' }];
        const betType = "2"; // Bet on Banker hand
        const result = await decideOutcome(4, 7, playerHand, bankerHand, betType);
        expect(result).toEqual({ outcome: 'Win', winnings: 1.95 }); // Banker wins, player bet on banker
      });
    
      test('player loses when betting on player but banker wins', async () => {
        const playerHand = [{ value: 2, suit: 'Hearts' }, { value: 4, suit: 'Diamonds' }];
        const bankerHand = [{ value: 9, suit: 'Clubs' }, { value: 0, suit: 'Spades' }];
        const betType = "1"; // Bet on Player hand
        const result = await decideOutcome(6, 9, playerHand, bankerHand, betType);
        expect(result).toEqual({ outcome: 'Lose', winnings: 0 });
      });
    
      test('player wins correctly when betting on a tie and a tie occurs', async () => {
        const playerHand = [{ value: 5, suit: 'Hearts' }, { value: 5, suit: 'Diamonds' }];
        const bankerHand = [{ value: 0, suit: 'Clubs' }, { value: 10, suit: 'Spades' }];
        const betType = "3"; // Bet on a tie
        const result = await decideOutcome(0, 0, playerHand, bankerHand, betType);
        expect(result).toEqual({ outcome: 'Win', winnings: 8 });
      });
    
      test('player wins with player pair bet when player has a pair', async () => {
        const playerHand = [{ value: 2, suit: 'Hearts' }, { value: 2, suit: 'Diamonds' }];
        const bankerHand : Array<Card> = []; // Banker hand is irrelevant for this bet type
        const betType = "4"; // Bet on Player pair
        const result = await decideOutcome(4, 0, playerHand, bankerHand, betType);
        expect(result).toEqual({ outcome: 'Win', winnings: 11 });
      });
    
      test('player wins with banker pair bet when banker has a pair', async () => {
        const playerHand: Array<Card>  = []; // Player hand is irrelevant for this bet type
        const bankerHand = [{ value: 3, suit: 'Clubs' }, { value: 3, suit: 'Spades' }];
        const betType = "5"; // Bet on Banker pair
        const result = await decideOutcome(0, 6, playerHand, bankerHand, betType);
        expect(result).toEqual({ outcome: 'Win', winnings: 11 });
      });
    
      test('player loses when no pair occurs but bet on player or banker pair', async () => {
        const playerHand = [{ value: 2, suit: 'Hearts' }, { value: 4, suit: 'Diamonds' }];
        const bankerHand = [{ value: 3, suit: 'Clubs' }, { value: 5, suit: 'Spades' }];
        const betType = "4"; // Assuming bet on Player pair
        const resultPlayerPair = await decideOutcome(6, 8, playerHand, bankerHand, betType);
        expect(resultPlayerPair).toEqual({ outcome: 'Lose', winnings: 0 });
    
        const betTypeBankerPair = "5"; // Assuming bet on Banker pair
        const resultBankerPair = await decideOutcome(6, 8, playerHand, bankerHand, betTypeBankerPair);
        expect(resultBankerPair).toEqual({ outcome: 'Lose', winnings: 0 });
      });
    });
  
    // Additional tests can be structured in a similar way...
  });
  