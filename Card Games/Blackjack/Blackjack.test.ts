import { createBlackjackDeck } from "../Deck/Deck";
import { calculateHandValue, checkForBlackjack, dealerTurn, getBet, startGame, playerTurn} from "./Blackjack";
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
  
  jest.mock('../../userInput/readUserInput', () => ({
    readUserInput: jest.fn().mockImplementation((prompt, max) => {
      if (prompt.toLowerCase().includes("how much would you like to bet?")) {
        return Promise.resolve('100'); // Simulate user entering '100'
      }
      return Promise.resolve('n'); // Default response for other prompts
    })
  }));
  
  
  describe('getBet', () => {
    test('validates player bet correctly', async () => {
      const player = { name: 'Test', password : "123" ,balance: 500, hand: [] };
      const bet = await getBet(player);
      expect(bet).toBe(100); // Assuming the mock response is '100'
    });
  });

  describe('getBet with invalid input followed by valid input', () => {
    test('re-prompts and accepts valid input after invalid input', async () => {
      jest.mock('../../userInput/readUserInput', () => ({
        readUserInput: jest.fn()
          .mockImplementationOnce(() => Promise.resolve('5000')) // First input exceeds player balance
          .mockImplementationOnce(() => Promise.resolve('100')) // Second input is valid
      }));
  
      const player = { name: 'Test', password: "123", balance: 500, hand: [] };
      const bet = await getBet(player);
      expect(bet).toBe(100); // Expecting the valid input to be accepted after initial invalid input
    });
  });
  
  
  
  
  
  
  

  
  
  
  
  
