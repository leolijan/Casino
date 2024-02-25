import {
    calculateHandValue,
    playerHand,
    bankerHand,
    decideOutcome
  } from '../Baccarat/Baccarat'; 
  
  
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
  });
  
  