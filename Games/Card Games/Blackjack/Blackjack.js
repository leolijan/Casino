"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = exports.getBet = exports.dealerTurn = exports.playerTurn = exports.checkForBlackjack = exports.calculateHandValue = void 0;
var readUserInput_1 = require("../../../userInput/readUserInput");
var Deck_1 = require("../Deck/Deck");
var Player_1 = require("../../../Player/Player");
/**
 * Calculates the total value of a hand in Blackjack, taking into account the
 * special rules for Aces (value of 11 or 1 to avoid busting if possible).
 * @param hand An array of Card objects representing the hand.
 * @returns The total value of the hand.
 */
function calculateHandValue(hand) {
    var total = 0;
    // Count the number of Aces in the hand (Aces are represented as value 14)
    var aceCount = hand.filter(function (card) { return card.value === 14; }).length;
    // Iterate over each card in the hand to calculate the total value
    hand.forEach(function (card) {
        if (card.value >= 11 && card.value <= 13) {
            // Face cards (Jack, Queen, King) are worth 10 points
            total += 10;
        }
        else if (card.value === 14) {
            // Aces are initially counted as 11 points
            total += 11;
        }
        else {
            // Other cards are worth their face value
            total += card.value;
        }
    });
    // Adjust for Aces: if total value exceeds 21 and there are Aces in the hand,
    // convert some Aces from 11 points to 1 point to reduce the total value
    while (total > 21 && aceCount > 0) {
        total -= 10; // Subtracting 10 adjusts an Ace from 11 points to 1 point
        aceCount--; // Decrement the count of Aces that are being treated as 11
    }
    return total;
}
exports.calculateHandValue = calculateHandValue;
/**
 * Checks if a hand is a blackjack (a total value of 21 with exactly two cards)
 * @param hand The hand to check.
 * @returns True if the hand is a blackjack, false otherwise.
 */
function checkForBlackjack(hand) {
    var value = calculateHandValue(hand);
    return hand.length === 2 && value === 21;
}
exports.checkForBlackjack = checkForBlackjack;
/**
 * Handles the player's turn in a game of Blackjack,
 * allowing them to hit, stand, or double down.
 * @param deck The current deck of cards.
 * @param player A Person object representing the player..
 * @param bet The current bet amount.
 * @returns Returns false if the player's turn
 * ends (blackjack or bust) or true if the player stands.
 */
function playerTurn(deck, player, originalBet) {
    return __awaiter(this, void 0, void 0, function () {
        var playerTotal, bet, doubledDown, prompt_1, hitOrStand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    playerTotal = calculateHandValue(player.hand);
                    bet = originalBet;
                    doubledDown = false;
                    _a.label = 1;
                case 1:
                    if (!(playerTotal < 21)) return [3 /*break*/, 3];
                    console.log("Your total is ".concat(playerTotal, "."));
                    prompt_1 = "Hit (1), stand (2), or double down (3)? (Current balance: $" + player.balance + ")";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(prompt_1, 3)];
                case 2:
                    hitOrStand = _a.sent();
                    if (hitOrStand === "3" && !doubledDown && player.hand.length === 2 && player.balance >= bet * 2) {
                        player.balance -= bet; // Deduct an additional bet for doubling down
                        bet *= 2; // Double the bet
                        player.hand.push(deck.pop()); // Draw one card
                        console.log("You doubled down and drew a card.");
                        doubledDown = true; // Mark as doubled down
                        playerTotal = calculateHandValue(player.hand);
                        return [3 /*break*/, 3];
                    }
                    else if (hitOrStand === "1") {
                        player.hand.push(deck.pop());
                        console.log("You drew a card.");
                        playerTotal = calculateHandValue(player.hand);
                    }
                    else if (hitOrStand === "2") {
                        return [3 /*break*/, 3]; // Player chooses to stand
                    }
                    return [3 /*break*/, 1];
                case 3: return [4 /*yield*/, (0, Deck_1.showHand)(player)];
                case 4:
                    _a.sent();
                    if (playerTotal > 21) {
                        console.log("Bust! You lose.");
                        player.balance -= bet; // Adjust the balance for the final bet amount
                        return [2 /*return*/, false]; // Player busts
                    }
                    return [2 /*return*/, true]; // Player stands without busting
            }
        });
    });
}
exports.playerTurn = playerTurn;
/**
 * Handles the dealer's turn in Blackjack,
 * drawing cards until the total value is 17 or higher.
 * @param deck The deck of cards used in the game.
 * @param dealer A Person object representing the dealer.
 * @returns The total value of the dealer's hand at
 * the end of their turn.
 */
function dealerTurn(deck, dealer) {
    return __awaiter(this, void 0, void 0, function () {
        var dealerTotal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealerTotal = calculateHandValue(dealer.hand);
                    // Check if the dealer has a blackjack
                    if (checkForBlackjack(dealer.hand)) {
                        console.log("Dealer has Blackjack!");
                        return [2 /*return*/, 21]; // Blackjack value
                    }
                    // Dealer draws cards until the total is 17 or higher
                    while (dealerTotal < 17) {
                        // Safely pop a card from the deck and add it to the dealer's hand
                        dealer.hand.push(deck.pop());
                        // Recalculate the dealer's total hand value after drawing a card
                        dealerTotal = calculateHandValue(dealer.hand);
                    }
                    // Show dealer's hand to the player
                    return [4 /*yield*/, (0, Deck_1.showHand)(dealer)];
                case 1:
                    // Show dealer's hand to the player
                    _a.sent();
                    return [2 /*return*/, dealerTotal];
            }
        });
    });
}
exports.dealerTurn = dealerTurn;
/**
 * Prompts the player to place a bet, ensuring the bet is within their
 * available balance.
 * @param player The player making the bet.
 * @returns The amount bet by the player.
 */
function getBet(player) {
    return __awaiter(this, void 0, void 0, function () {
        var bet, prompt, betString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bet = 0;
                    prompt = "You have $".concat(player.balance, ". How much would you like to bet? ");
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(prompt, player.balance)];
                case 1:
                    betString = _a.sent();
                    bet = parseInt(betString, 10); // Convert the input string to a number.
                    return [2 /*return*/, bet]; // Return the validated bet amount
            }
        });
    });
}
exports.getBet = getBet;
/**
 * Starts and manages the Blackjack game.
 * @param player The player represented as a Person object.
 */
function startGame(player) {
    return __awaiter(this, void 0, void 0, function () {
        var deck, dealer, bet, playAgain, playerTurnOutcome, dealerTotal, playerTotal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealer = (0, Player_1.createPerson)("Dealer", "", 0);
                    playAgain = '';
                    _a.label = 1;
                case 1:
                    player.hand = [];
                    dealer.hand = [];
                    deck = (0, Deck_1.createBlackjackDeck)();
                    console.log("Welcome to Blackjack!");
                    return [4 /*yield*/, getBet(player)];
                case 2:
                    bet = _a.sent(); // Assuming getBet is properly implemented
                    (0, Deck_1.dealInitialCards)(deck, player);
                    (0, Deck_1.dealInitialCards)(deck, dealer);
                    console.log("Your hand:");
                    (0, Deck_1.showHand)(player); // Assuming showHand is properly implemented
                    if (!(checkForBlackjack(player.hand) && checkForBlackjack(dealer.hand))) return [3 /*break*/, 3];
                    console.log("Both you and the dealer have Blackjack! It's a push.");
                    return [3 /*break*/, 8];
                case 3:
                    if (!checkForBlackjack(player.hand)) return [3 /*break*/, 4];
                    console.log("Blackjack! You win 1.5x your bet.");
                    player.balance += bet * 1.5;
                    return [3 /*break*/, 8];
                case 4: return [4 /*yield*/, playerTurn(deck, player, bet)];
                case 5:
                    playerTurnOutcome = _a.sent();
                    if (!!playerTurnOutcome) return [3 /*break*/, 6];
                    console.log("You bust!");
                    player.balance -= bet;
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, dealerTurn(deck, dealer)];
                case 7:
                    dealerTotal = _a.sent();
                    playerTotal = calculateHandValue(player.hand);
                    if (dealerTotal > 21 || playerTotal > dealerTotal) {
                        console.log("You win!");
                        player.balance += bet;
                    }
                    else if (playerTotal < dealerTotal) {
                        console.log("Dealer wins.");
                        player.balance -= bet;
                    }
                    else {
                        console.log("It's a push.");
                    }
                    _a.label = 8;
                case 8:
                    if (!(player.balance > 0)) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Do you want to play again? (Yes=1/No=2): ", 2)];
                case 9:
                    playAgain = _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    console.log("You've run out of funds! Game over.");
                    return [3 /*break*/, 12];
                case 11:
                    if (playAgain === "1") return [3 /*break*/, 1];
                    _a.label = 12;
                case 12:
                    console.log("Thank you for playing!");
                    return [2 /*return*/];
            }
        });
    });
}
exports.startGame = startGame;
