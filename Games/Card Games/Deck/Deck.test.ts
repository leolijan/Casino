import { createDeck, shuffleDeck, createBlackjackDeck, 
         ensureDeckNotEmpty, dealInitialCards, isPair, showHand} from './Deck'; 

test('createDeck creates a deck of 52 cards', () => {
    expect(createDeck().length).toBe(52);
});
  
test('All cards in createDeck are unique', () => {
    const deck = createDeck();
    const uniqueCards = new Set(deck.map(card => `${card.suit}-${card.value}`));
    expect(uniqueCards.size).toBe(52);
});
  
test('shuffleDeck changes the deck order', () => {
    const deck = createDeck();
    const originalOrder = deck.map(card => `${card.suit}-${card.value}`);
    const shuffledOrder = shuffleDeck([...deck]);
    
    expect(originalOrder).not.toEqual(shuffledOrder);
});
  
test('Deck contains 4 suits, each with 13 cards', () => {
    const deck = createDeck();
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    suits.forEach(suit => {
      expect(deck.filter(card => card.suit === suit).length).toBe(13);
    });
});

test('should create a deck of 416 cards', () => {
    const deck = createBlackjackDeck();
    expect(deck.length).toBe(416);
});

test('replenishes the deck if it has fewer than 10 cards', () => {
  let deck = [{ value: 10, suit: "spades"}]; 
  ensureDeckNotEmpty(deck);

  // The deck should now have at least 10 cards
  expect(deck.length).toBeGreaterThanOrEqual(10);
});

test('does not modify the deck if it already has 10 or more cards', () => {
  let deck = new Array(10).fill({ value: 10, suit: "Spades"}); 
  ensureDeckNotEmpty(deck);
  expect(deck.length).toEqual(10);
});

test('dealInitialCards gives two cards to a person', () => {
  const deck= [{ value: 10, suit: "Spades"}, { value: 9, suit: "Spades"}];

  const person = {
    name: "Leo",
    password: "123", 
    balance: 1000,
    hand : [],
  };

  dealInitialCards(deck, person);

  expect(person.hand.length).toBe(2);
  expect(deck.length).toBe(416); 
});

test('isPair returns true for a pair of cards with the same value', () => {
  const pairHand= [{ value: 10, suit: "Spades"}, { value: 10, suit: "Hearts"}];

  expect(isPair(pairHand)).toBe(true);
});

test('isPair returns false for a hand of cards with different values', () => {
  const notPairHand = [{ value: 11, suit: "Spades"}, 
                       { value: 10, suit: "Hearts"}];

  expect(isPair(notPairHand)).toBe(false);
});

test('isPair returns false for a hand with more than two cards', () => {
  const moreThanTwoCardsHand = [{ value: 10, suit: "Clubs"}, 
                                { value: 10, suit: "Hearts"}, 
                                { value: 10, suit: "Spades"}];

  expect(isPair(moreThanTwoCardsHand)).toBe(false);
});

describe('showHand functionality', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Spy on console.log before each test
    consoleSpy = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('correctly logs a person\'s hand', () => {
    const mockPerson = {
      name: 'Leo',
      password: 'secret', 
      balance: 100, 
      hand: [
        { value: 10, suit: 'Hearts' },
        { value: 11, suit: 'Spades' }, 
      ]
    };

    const expectedMessage = "Leo's hand: 10 of Hearts, 11 of Spades";

    showHand(mockPerson);
    expect(consoleSpy).toHaveBeenCalledWith(expectedMessage);
  });
});