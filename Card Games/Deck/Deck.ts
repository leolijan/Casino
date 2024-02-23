import { Person } from "../../Player/Player";
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

/**
 * Ensures the deck is not running low on cards. If the deck has fewer than 10 cards,
 * a new shuffled deck is created and added to the existing deck to replenish it.
 *
 * @param {Card[]} deck - The current deck of cards.
 */
export function ensureDeckNotEmpty(deck: Card[]): void {
    if (deck.length < 10) {
        const newDeck = createBlackjackDeck();
        deck.push(...newDeck);
    }
}

/**
 * Deals two initial cards from the deck to a person's hand.
 * This function assumes that the deck has at least two cards.
 *
 * @param {Card[]} deck - The deck of cards to deal from.
 * @param {Person} person - The person receiving the initial cards.
 */
export function dealInitialCards(deck: Card[], person: Person): void {
    ensureDeckNotEmpty(deck); // Ensures the deck is not empty
    person.hand.push(deck.pop()!, deck.pop()!); // Adds two cards to the person's hand
  }
  
/**
 * Determines if a hand consists of a pair of cards with the same value.
 *
 * @example
 * isPair(hand); // returns true
 *
 * @param {Card[]} hand - The hand to check for a pair.
 * @returns {boolean} - Returns true if the hand is a pair; otherwise, false.
 */
export function isPair(hand: Card[]): boolean {
    if (hand.length !== 2) return false;
    return hand[0].value === hand[1].value;
}

/**
 * Prints a summary of a person's hand to the console.
 *
 * @param {Person} person - The person whose hand will be displayed.
 */
export function showHand(person: Person): void {
    // Building the string representation of the hand
    const handRepresentation = person.hand.map(card => `${card.value} of ${card.suit}`).join(', ');
    console.log(`${person.name}'s hand: ${handRepresentation}`);
}
