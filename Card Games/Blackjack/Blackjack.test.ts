import { createBlackjackDeck } from "../Deck/Deck";
import { calculateHandValue, checkForBlackjack, dealerTurn, getBet} from "./Blackjack";
import { createPerson } from "../../Player/Player";

describe('calculateHandValue', () => {
    test('correctly sums the value of non-ace cards', () => {
      const hand = [{ value: 2, suit: 'Hearts' }, { value: 3, suit: 'Diamonds' }];
      expect(calculateHandValue(hand)).toBe(5);
    });
  
    test('correctly handles aces', () => {
      const hand = [{ value: 14, suit: 'Hearts' }, { value: 14, suit: 'Diamonds' }];
      // First ace counts as 11, second as 1 to avoid busting
      expect(calculateHandValue(hand)).toBe(12);
    });
  });
  

describe('checkForBlackjack', () => {
    test('returns true for a blackjack hand', () => {
      const hand = [{ value: 10, suit: 'Hearts' }, { value: 14, suit: 'Spades' }];
      expect(checkForBlackjack(hand)).toBeTruthy();
    });
  
    test('returns false for a non-blackjack hand', () => {
      const hand = [{ value: 9, suit: 'Hearts' }, { value: 9, suit: 'Spades' }];
      expect(checkForBlackjack(hand)).toBeFalsy();
    });
  });
  
  jest.mock('node:readline/promises', () => ({
    createInterface: jest.fn().mockReturnValue({
      question: jest.fn().mockImplementation((questionText) => {
        if (questionText.includes("bet")) return Promise.resolve('100');
        // Add conditions based on questionText to simulate player choices
        return Promise.resolve('n'); // Default response
      }),
      close: jest.fn(),
    }),
  }));
  
  describe('getBet', () => {
    test('validates player bet correctly', async () => {
      const player = { name: 'Test', password : "123" ,balance: 500, hand: [] };
      const bet = await getBet(player);
      expect(bet).toBe(100); // Assuming the mock response is '100'
    });
  });
  
  // Mock deck operations if necessary to ensure predictable card outcomes
  
  

  
  
  
  
  
