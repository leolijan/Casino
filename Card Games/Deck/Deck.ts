export type Card = { value: number; suit: string };
export type Deck = Card[]; 

/**
 * Creates and returns a shuffled deck of cards.
 * @returns {Deck} A deck of shuffled cards.
 */
export function createDeck(): Deck {
    const suits: string[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    // 11-14 for J, Q, K, A
    const values: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; 
    let cards: Deck = [];

    for (let suit of suits) {
        for (let value of values) {
            cards.push({ value, suit });
        }
    }
    return shuffleDeck(cards);
}

/**
 * Shuffles the given deck of cards.
 * @param {Deck} cards - The deck of cards to be shuffled.
 * @returns {Deck} The shuffled deck of cards.
 */
export function shuffleDeck(cards: Deck): Deck {
    for (let i = cards.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
}

/**
 * Creates and returns a shuffled deck of cards specifically designed for 
 * Blackjack, consisting of 8 standard 52-card decks combined, 
 * for a total of 416 cards.
 * @returns {Deck} A large deck of shuffled cards for Blackjack, 
 * 8 times the size of a standard deck.
 */ 
export function createBlackjackDeck(): Deck {
    const suits: string[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    // 11-14 for J, Q, K, A
    const values: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; 
    let cards: Deck = [];

    for (let deckIndex = 0; deckIndex < 8; deckIndex++) {
        for (let suit of suits) {
            for (let value of values) {
                cards.push({ value, suit });
            }
        }
    }
    return shuffleDeck(cards);
}

