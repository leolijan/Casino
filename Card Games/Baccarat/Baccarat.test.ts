import {
    calculateHandValue,
    playerHand,
    bankerHand,
    decideOutcome
  } from '../Baccarat/Baccarat'; 
  import { Card, createBlackjackDeck as createBaccaratDeck, dealInitialCards, } from '../Deck/Deck';
  import { Person, createPerson } from '../../Player/Player';

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
  