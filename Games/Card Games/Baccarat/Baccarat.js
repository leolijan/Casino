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
exports.startGame = exports.decideOutcome = exports.bankerHand = exports.playerHand = exports.calculateHandValue = void 0;
var readUserInput_1 = require("../../../Utilities/userInput/readUserInput");
var Deck_1 = require("../Deck/Deck");
/**
 * Calculates the total value of a hand, according to the rules of baccarat.
 * @param hand An array of Card objects representing the hand.
 * @returns The total value of the hand.
 */
function calculateHandValue(hand) {
    var total = 0;
    // Calculates card values according to the rules of Baccarat.
    hand.forEach(function (card) {
        if (card.value >= 10 && card.value <= 13) {
            total += 0;
        }
        else if (card.value === 14) {
            total += 1;
        }
        else {
            total += card.value;
        }
    });
    // Hands are valued modulo 10.
    return (total % 10);
}
exports.calculateHandValue = calculateHandValue;
/**
 * Manages the player's hand according to the rules of baccarat
 * @param deck The current deck of cards.
 * @param player A Person object representing the player.
 * @returns The total value of the player hand.
 */
function playerHand(deck, player) {
    return __awaiter(this, void 0, void 0, function () {
        var playerTotal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, calculateHandValue(player.hand)];
                case 1:
                    playerTotal = _a.sent();
                    if (!(playerTotal >= 6)) return [3 /*break*/, 2];
                    return [2 /*return*/, playerTotal];
                case 2:
                    player.hand.push(deck.pop());
                    return [4 /*yield*/, calculateHandValue(player.hand)];
                case 3: return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
exports.playerHand = playerHand;
/**
 * Manages the banker's hand by following specific drawing rules that are based
 * on the value of the banker's hand and the player's third card.
 * @param deck The deck of cards that are represented as an array of type Card.
 * @param banker A Person object representing the banker.
 * @param player A Person object representing the player.
 * @returns The total value of the banker's hand.
 */
function bankerHand(deck, banker, player) {
    return __awaiter(this, void 0, void 0, function () {
        // Draws a third card for the banker and calculates the new card values.
        function bankerThirdCard() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            banker.hand.push(deck.pop());
                            return [4 /*yield*/, calculateHandValue(banker.hand)];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                });
            });
        }
        // Specific rules for drawing of banker's third card.
        function bankerRules() {
            return __awaiter(this, void 0, void 0, function () {
                var playerThirdCard;
                return __generator(this, function (_a) {
                    playerThirdCard = player.hand[2].value;
                    if (bankerTotal <= 2) {
                        return [2 /*return*/, bankerThirdCard()];
                    }
                    else if (bankerTotal === 3 && playerThirdCard === 8) {
                        return [2 /*return*/, bankerThirdCard()];
                    }
                    else if (bankerTotal === 4 &&
                        (playerThirdCard >= 2 && playerThirdCard <= 7)) {
                        return [2 /*return*/, bankerThirdCard()];
                    }
                    else if (bankerTotal === 5 &&
                        (playerThirdCard >= 4 && playerThirdCard <= 7)) {
                        return [2 /*return*/, bankerThirdCard()];
                    }
                    else {
                        return [2 /*return*/, bankerTotal];
                    }
                    return [2 /*return*/];
                });
            });
        }
        var bankerTotal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, calculateHandValue(banker.hand)];
                case 1:
                    bankerTotal = _a.sent();
                    // Depending on the value of the first two cards and the rules of the banker,
                    // either no more cards will be drawn or a third card will be drawn.
                    if (bankerTotal <= 5) {
                        if (player.hand.length === 3) {
                            return [2 /*return*/, bankerRules()];
                        }
                        else {
                            return [2 /*return*/, bankerThirdCard()];
                        }
                    }
                    else { }
                    return [2 /*return*/, bankerTotal];
            }
        });
    });
}
exports.bankerHand = bankerHand;
/**
 * Decides the outcome of the game based on the type of bet made and
 * the player and banker hands.
 * @param playerValue Total value of the player's hand.
 * @param bankerValue Total value of the banker's hand.
 * @param playerHand The player's hand.
 * @param bankerHand The banker's hand.
 * @param betType Type of bet made by the player.
 * @returns An object containing the outcome and potential winnings.
 */
function decideOutcome(playerValue, bankerValue, playerHand, bankerHand, betType) {
    var outcome = "";
    var winnings = 0;
    // Decides the outcome based on the option chosen by the player.
    if (betType === "1") {
        if (playerValue > bankerValue) {
            outcome = "Win";
            winnings = 2;
        }
        else {
            outcome = "Lose";
        }
    }
    else if (betType === "2") {
        if (bankerValue > playerValue) {
            outcome = "Win";
            winnings = 1.95; // 5% commission
        }
        else {
            outcome = "Lose";
        }
    }
    else if (betType === "3") {
        if (playerValue === bankerValue) {
            outcome = "Win";
            winnings = 8;
        }
        else {
            outcome = "Lose";
        }
    }
    else if (betType === "4") {
        if ((0, Deck_1.isPair)(playerHand)) {
            outcome = "Win";
            winnings = 11;
        }
        else {
            outcome = "Lose";
        }
    }
    else if (betType === "5") {
        if ((0, Deck_1.isPair)(bankerHand)) {
            outcome = "Win";
            winnings = 11;
        }
        else {
            outcome = "Lose";
        }
    }
    else {
        outcome = "Lose";
    }
    return { outcome: outcome, winnings: winnings };
}
exports.decideOutcome = decideOutcome;
/**
 * Starts and manages the Baccarat game.
 * @param player The player represented as a Person object.
 */
function startGame(player) {
    return __awaiter(this, void 0, void 0, function () {
        var deck, banker, prompt_1, bet, options, userInput, finalPlayerHand, finalBankerHand, _a, outcome, winnings, playAgainOptions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!true) return [3 /*break*/, 11];
                    player.hand = [];
                    deck = (0, Deck_1.createBlackjackDeck)();
                    banker = { name: "Banker", password: "",
                        balance: 0, hand: [] };
                    prompt_1 = "You have $" + player.balance +
                        ". How much would you like to bet? ";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(prompt_1, player.balance)];
                case 1:
                    bet = _b.sent();
                    console.log("Welcome to Baccarat!");
                    options = "1. Bet on Player hand\n" +
                        "2. Bet on Banker hand\n" +
                        "3. Bet on a tie\n" +
                        "4. Bet on a player pair\n" +
                        "5. Bet on a banker pair\n";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(options, 5)];
                case 2:
                    userInput = _b.sent();
                    return [4 /*yield*/, (0, Deck_1.dealInitialCards)(deck, player)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, Deck_1.dealInitialCards)(deck, banker)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, playerHand(deck, player)];
                case 5:
                    finalPlayerHand = _b.sent();
                    return [4 /*yield*/, bankerHand(deck, banker, player)];
                case 6:
                    finalBankerHand = _b.sent();
                    return [4 /*yield*/, (0, Deck_1.showHand)(player)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, (0, Deck_1.showHand)(banker)];
                case 8:
                    _b.sent();
                    console.log("Final value for player hand: " + finalPlayerHand);
                    console.log("Final value for banker hand: " + finalBankerHand);
                    return [4 /*yield*/, decideOutcome(finalPlayerHand, finalBankerHand, player.hand, banker.hand, userInput)];
                case 9:
                    _a = _b.sent(), outcome = _a.outcome, winnings = _a.winnings;
                    // Manages potential winnings and losses.
                    if (outcome === "Win") {
                        console.log("You win");
                        player.balance += Number(bet) * winnings;
                    }
                    else {
                        console.log("You lose");
                        player.balance -= Number(bet);
                    }
                    if (player.balance <= 0) {
                        console.log("You've run out of funds! Game over.");
                        return [3 /*break*/, 11];
                    }
                    else { }
                    playAgainOptions = "Would you like to play again? Yes(1) or No(2): ";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(playAgainOptions, 2)];
                case 10:
                    userInput = _b.sent();
                    if (userInput === "1") {
                        return [3 /*break*/, 0];
                    }
                    else {
                        return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 0];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.startGame = startGame;
