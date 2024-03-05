import { Person } from "../../../Utilities/Player/Player";
export type Card = { value: number; suit: string };
export type Deck = Array<Card>; 


/**
 * Generates a shuffled deck of cards suitable for card games.
 *
 * @example
 * const deck = createDeck();
 * // deck now contains a shuffled 52-card deck
 *
 * @returns A deck of shuffled cards, including 13 cards of each suit 
 *          (Hearts, Diamonds, Clubs, Spades), with values ranging from 2 to 14 
 *          (Ace represented as 14).
 */
export function createDeck(): Deck {
    const suits: Array<string> = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    // 11-14 for J, Q, K, A
    const values: Array<number> = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; 
    let cards: Deck = [];

    for (let suit of suits) {
        for (let value of values) {
            cards.push({ value, suit });
        }
    }
    return shuffleDeck(cards);
}


/**
 * Shuffles a given deck of cards using the Fisher-Yates shuffle algorithm.
 *
 * @example
 * const shuffledDeck = shuffleDeck(deck);
 * // shuffledDeck is now a randomly shuffled version of the original deck
 *
 * @param cards The deck of cards to be shuffled.
 * @returns The shuffled deck of cards.
 */
export function shuffleDeck(cards: Deck): Deck {
    for (let i = cards.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
}

/**
 * Creates a shuffled deck of cards for Blackjack, 
 * consisting of 8 combined standard 52-card decks.
 *
 * @example
 * const deck = createBlackjackDeck();
 * // deck now contains 416 shuffled cards suitable for Blackjack
 *
 * @returns A deck of cards, 8 times the size of a standard deck, 
 * shuffled for Blackjack.
 */

export function createBlackjackDeck(): Deck {
    const suits: Array<string> = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    // 11-14 for J, Q, K, A
    const values: Array<number> = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; 
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
 * Ensures the deck has sufficient cards for gameplay. 
 * If the deck has fewer than 10 cards, 
 * a new shuffled deck is created and combined with the existing deck.
 *
 * @example
 * // Assuming deck is initialized and possibly depleted
 * ensureDeckNotEmpty(deck);
 * // Deck is replenished if it had fewer than 10 cards
 *
 * @param deck The current deck of cards, potentially low on cards.
 * @returns void. The deck is replenished with a new shuffled deck if necessary.
 */
export function ensureDeckNotEmpty(deck: Array<Card>): void {
    if (deck.length < 10) {
        const newDeck = createBlackjackDeck();
        deck.push(...newDeck);
    }
}

/**
 * Deals two initial cards from a given deck to a person's hand.
 *
 * @example
 * // Assuming deck is initialized and person object is defined
 * dealInitialCards(deck, person);
 * // Person's hand now contains two cards from the deck
 *
 * @param deck The deck of cards to deal from, assumed to have at 
 * least two cards.
 * @param person The person receiving the initial two cards into their hand.
 * @returns void. The person's hand is updated with two cards from the deck.
 */
export function dealInitialCards(deck: Array<Card>, person: Person): void {
    // Ensures the deck is not empty
    ensureDeckNotEmpty(deck); 

    // Adds two cards to the person's hand
    person.hand.push(deck.pop()!, deck.pop()!); 
  }
  
/**
 * Determines if a hand consists of a pair of cards with the same value.
 *
 * @example
 * isPair(hand); // returns true
 *
 * @param hand - The hand to check for a pair.
 * @returns - Returns true if the hand is a pair; otherwise, false.
 */
export function isPair(hand: Array<Card>): boolean {
    if (hand.length !== 2) return false;
    return hand[0].value === hand[1].value;
}

/**
 * Allows a user to add money to their account by selecting a predefined amount 
 * or entering a custom one.
 *
 * @example
 * // User chooses to add $100 or enters a custom amount
 * await insertMoney("TestUser", allUsers);
 * // The chosen amount is added to TestUsers account balance
 *
 * @param username The username of the currently logged-in user.
 * @param allUsers The collection of all users' data.
 *
 * @returns void. Updates the user's balance with the chosen or entered amount.
 */
export function showHand(person: Person): void {
    // Building the string representation of the hand
    const hand = person.hand.map(card => 
                                    `${card.value} of ${card.suit}`).join(', ');
                                    
    console.log(`${person.name}'s hand: ${hand}`);
}
