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
exports.getBet = exports.dealerTurn = exports.checkForBlackjack = exports.calculateHandValue = void 0;
var readUserInput_1 = require("../../userInput/readUserInput");
var Deck_1 = require("../Deck/Deck");
var Player_1 = require("../../Player/Player");
/**
 * Calculates the total value of a hand in Blackjack, taking into account the
 * special rules for Aces (value of 11 or 1 to avoid busting if possible).
 * @param {Card[]} hand - The array of cards in the hand.
 * @returns {number} The total value of the hand.
 */
function calculateHandValue(hand) {
    var total = 0;
    var aceCount = hand.filter(function (card) { return card.value === 14; }).length;
    hand.forEach(function (card) {
        if (card.value >= 11 && card.value <= 13) {
            total += 10;
        }
        else if (card.value === 14) {
            total += 11;
        }
        else {
            total += card.value;
        }
    });
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }
    return total;
}
exports.calculateHandValue = calculateHandValue;
/**
 * Checks if a hand is a blackjack (a total value of 21 with exactly two cards).
 * @param {Card[]} hand - The hand to check.
 * @returns {boolean} True if the hand is a blackjack, false otherwise.
 */
function checkForBlackjack(hand) {
    var value = calculateHandValue(hand);
    return hand.length === 2 && value === 21;
}
exports.checkForBlackjack = checkForBlackjack;
/**
 * Handles the player's turn in a game of Blackjack, allowing them to hit, stand, or double down.
 * @param {Card[]} deck - The current deck of cards.
 * @param {Person} player - The player object.
 * @param {number} bet - The current bet amount.
 * @returns {Promise<boolean>} - Returns false if the player's turn ends (blackjack or bust) or true if the player stands.
 */
function playerTurn(deck, player, bet) {
    return __awaiter(this, void 0, void 0, function () {
        var playerTotal, doubledDown, hitOrStand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    playerTotal = calculateHandValue(player.hand);
                    doubledDown = false;
                    if (checkForBlackjack(player.hand)) {
                        console.log("Blackjack! You win 1.5x your bet.");
                        player.balance += bet * 1.5;
                        return [2 /*return*/, false];
                    }
                    _a.label = 1;
                case 1:
                    if (!(playerTotal < 21)) return [3 /*break*/, 3];
                    console.log("Your total is ".concat(playerTotal, "."));
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)('Do you want to hit(1), stand(2), or double down(3)? ', 3)];
                case 2:
                    hitOrStand = _a.sent();
                    if (hitOrStand.toLowerCase() === 'd' && !doubledDown && player.hand.length === 2) {
                        player.balance -= bet;
                        bet *= 2;
                        player.hand.push(deck.pop());
                        console.log("You doubled down and drew a card.");
                        doubledDown = true;
                        playerTotal = calculateHandValue(player.hand);
                        return [3 /*break*/, 3]; // Exit loop since player decided to double down
                    }
                    else if (hitOrStand.toLowerCase() === 'h') {
                        player.hand.push(deck.pop());
                        console.log("You drew a card.");
                        playerTotal = calculateHandValue(player.hand);
                    }
                    else {
                        return [3 /*break*/, 3]; // Player stands
                    }
                    return [3 /*break*/, 1];
                case 3: return [4 /*yield*/, (0, Deck_1.showHand)(player)];
                case 4:
                    _a.sent(); // Ensure you have a function to display the player's hand
                    if (playerTotal > 21) {
                        console.log('Bust! You lose.');
                        player.balance -= bet;
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true]; // Player stands
            }
        });
    });
}
/**
 * Handles the dealer's turn in Blackjack, drawing cards until the total value is 17 or higher.
 * @param {Card[]} deck - The deck of cards used in the game.
 * @param {Person} dealer - The dealer's hand.
 * @returns {Promise<number>} The total value of the dealer's hand at the end of their turn.
 */
function dealerTurn(deck, dealer) {
    return __awaiter(this, void 0, void 0, function () {
        var dealerTotal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dealerTotal = calculateHandValue(dealer.hand);
                    if (checkForBlackjack(dealer.hand)) {
                        console.log("Dealer has Blackjack!");
                        return [2 /*return*/, 21];
                    }
                    while (dealerTotal < 17) {
                        dealer.hand.push(deck.pop());
                        dealerTotal = calculateHandValue(dealer.hand);
                    }
                    return [4 /*yield*/, (0, Deck_1.showHand)(dealer)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, dealerTotal];
            }
        });
    });
}
exports.dealerTurn = dealerTurn;
/**
 * Prompts the player to place a bet, ensuring the bet is within their available balance.
 * @param {Person} player - The player making the bet.
 * @returns {Promise<number>} The amount bet by the player.
 */
function getBet(player) {
    return __awaiter(this, void 0, void 0, function () {
        var bet, betString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bet = 0;
                    _a.label = 1;
                case 1: return [4 /*yield*/, (0, readUserInput_1.readUserInput)("You have $".concat(player.balance, ". How much would you like to bet? "), player.balance)];
                case 2:
                    betString = _a.sent();
                    bet = parseInt(betString, 10);
                    if (isNaN(bet) || bet <= 0 || bet > player.balance) {
                        console.log("Invalid bet amount. Please enter a valid number within your balance.");
                    }
                    _a.label = 3;
                case 3:
                    if (isNaN(bet) || bet <= 0 || bet > player.balance) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4: return [2 /*return*/, bet];
            }
        });
    });
}
exports.getBet = getBet;
function startGame(player) {
    return __awaiter(this, void 0, void 0, function () {
        var deck, dealer, bet, playerBusts, dealerTotal, playerTotal, playAgain, playAgainOptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    player.hand = [];
                    deck = (0, Deck_1.createBlackjackDeck)();
                    dealer = { name: 'Dealer', password: '123', balance: 0, hand: [] };
                    console.log('Welcome to Blackjack!');
                    return [4 /*yield*/, getBet(player)];
                case 1:
                    bet = _a.sent();
                    return [4 /*yield*/, (0, Deck_1.dealInitialCards)(deck, player)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, Deck_1.dealInitialCards)(deck, dealer)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, Deck_1.showHand)(player)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, playerTurn(deck, player, bet)];
                case 5:
                    playerBusts = !(_a.sent());
                    if (!playerBusts) return [3 /*break*/, 6];
                    console.log("You lost $".concat(bet, ". Your new balance is $").concat(player.balance, "."));
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, dealerTurn(deck, dealer)];
                case 7:
                    dealerTotal = _a.sent();
                    playerTotal = calculateHandValue(player.hand);
                    if (dealerTotal > 21 || playerTotal > dealerTotal) {
                        console.log('You win!');
                        player.balance += bet;
                        console.log("You won $".concat(bet, ". Your new balance is $").concat(player.balance, "."));
                    }
                    else if (playerTotal < dealerTotal) {
                        console.log('Dealer wins.');
                        player.balance -= bet;
                        console.log("You lost $".concat(bet, ". Your new balance is $").concat(player.balance, "."));
                    }
                    else {
                        console.log("It's a tie (push).");
                    }
                    _a.label = 8;
                case 8:
                    if (player.balance <= 0) {
                        console.log("You've run out of funds! Game over.");
                        return [3 /*break*/, 11];
                    }
                    playAgainOptions = "Would you like to play again? Yes(1) or No(2): ";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(playAgainOptions, 2)];
                case 9:
                    playAgain = _a.sent();
                    _a.label = 10;
                case 10:
                    if (playAgain.toLowerCase() === '1') return [3 /*break*/, 0];
                    _a.label = 11;
                case 11:
                    console.log("Thank you for playing!");
                    return [2 /*return*/];
            }
        });
    });
}
startGame((0, Player_1.createPerson)('123', '123', 1000)); // Sample call to start the game with an example player
