import { createDeck, shuffleDeck, createBlackjackDeck } from './Deck'; // Adjust the import path as necessary

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
    const shuffledOrder = shuffleDeck([...deck]).map(card => `${card.suit}-${card.value}`);
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