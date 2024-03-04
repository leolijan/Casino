"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showHand = exports.isPair = exports.dealInitialCards = exports.ensureDeckNotEmpty = exports.createBlackjackDeck = exports.shuffleDeck = exports.createDeck = void 0;
/**
 * Creates and returns a shuffled deck of cards.
 * @returns A deck of shuffled cards.
 */
function createDeck() {
    var suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    // 11-14 for J, Q, K, A
    var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    var cards = [];
    for (var _i = 0, suits_1 = suits; _i < suits_1.length; _i++) {
        var suit = suits_1[_i];
        for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
            var value = values_1[_a];
            cards.push({ value: value, suit: suit });
        }
    }
    return shuffleDeck(cards);
}
exports.createDeck = createDeck;
/**
 * Shuffles the given deck of cards.
 * @param cards - The deck of cards to be shuffled.
 * @returns The shuffled deck of cards.
 */
function shuffleDeck(cards) {
    var _a;
    for (var i = cards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [cards[j], cards[i]], cards[i] = _a[0], cards[j] = _a[1];
    }
    return cards;
}
exports.shuffleDeck = shuffleDeck;
/**
 * Creates and returns a shuffled deck of cards specifically designed for
 * Blackjack, consisting of 8 standard 52-card decks combined,
 * for a total of 416 cards.
 * @returns {Deck} A large deck of shuffled cards for Blackjack,
 * 8 times the size of a standard deck.
 */
function createBlackjackDeck() {
    var suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    // 11-14 for J, Q, K, A
    var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    var cards = [];
    for (var deckIndex = 0; deckIndex < 8; deckIndex++) {
        for (var _i = 0, suits_2 = suits; _i < suits_2.length; _i++) {
            var suit = suits_2[_i];
            for (var _a = 0, values_2 = values; _a < values_2.length; _a++) {
                var value = values_2[_a];
                cards.push({ value: value, suit: suit });
            }
        }
    }
    return shuffleDeck(cards);
}
exports.createBlackjackDeck = createBlackjackDeck;
/**
 * Ensures the deck is not running low on cards. If the deck has fewer
 * than 10 cards, a new shuffled deck is created and added to the
 * existing deck to replenish it.
 * @param deck - The current deck of cards.
 */
function ensureDeckNotEmpty(deck) {
    if (deck.length < 10) {
        var newDeck = createBlackjackDeck();
        deck.push.apply(deck, newDeck);
    }
}
exports.ensureDeckNotEmpty = ensureDeckNotEmpty;
/**
 * Deals two initial cards from the deck to a person's hand.
 * This function assumes that the deck has at least two cards.
 *
 * @param deck - The deck of cards to deal from.
 * @param person - The person receiving the initial cards.
 */
function dealInitialCards(deck, person) {
    // Ensures the deck is not empty
    ensureDeckNotEmpty(deck);
    // Adds two cards to the person's hand
    person.hand.push(deck.pop(), deck.pop());
}
exports.dealInitialCards = dealInitialCards;
/**
 * Determines if a hand consists of a pair of cards with the same value.
 *
 * @example
 * isPair(hand); // returns true
 *
 * @param hand - The hand to check for a pair.
 * @returns - Returns true if the hand is a pair; otherwise, false.
 */
function isPair(hand) {
    if (hand.length !== 2)
        return false;
    return hand[0].value === hand[1].value;
}
exports.isPair = isPair;
/**
 * Prints a summary of a person's hand to the console.
 *
 * @param person - The person whose hand will be displayed.
 */
function showHand(person) {
    // Building the string representation of the hand
    var hand = person.hand.map(function (card) {
        return "".concat(card.value, " of ").concat(card.suit);
    }).join(', ');
    console.log("".concat(person.name, "'s hand: ").concat(hand));
}
exports.showHand = showHand;
