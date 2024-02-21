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
exports.startGame = void 0;
var promises_1 = require("node:readline/promises");
var node_process_1 = require("node:process");
var Deck_1 = require("../Deck/Deck"); // Assuming this can create a suitable deck
var Player_1 = require("../../Player/Player"); // Assuming this can create a person with a balance and hand
var rl = (0, promises_1.createInterface)({ input: node_process_1.stdin, output: node_process_1.stdout });
function dealCards(deck, person, cardCount) {
    if (cardCount === void 0) { cardCount = 2; }
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            (0, Deck_1.ensureDeckNotEmpty)(deck);
            for (i = 0; i < cardCount; i++) {
                person.hand.push(deck.pop());
            }
            return [2 /*return*/];
        });
    });
}
function calculateHandValue(hand) {
    var total = hand.reduce(function (acc, card) {
        if (card.value >= 10)
            return acc; // 10, J, Q, K are worth 0 points
        if (card.value === 14)
            return acc + 1; // Aces are worth 1 point
        return acc + card.value; // Other cards are face value
    }, 0);
    return total % 10;
}
function isPair(hand) {
    if (hand.length !== 2)
        return false;
    return hand[0].value === hand[1].value;
}
function getBets(player) {
    return __awaiter(this, void 0, void 0, function () {
        var betAmount, betType, betTypeString, betAmountString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    betAmount = 0;
                    betType = '';
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    console.log("Please choose the type of bet:");
                    console.log("1: Player wins");
                    console.log("2: Banker wins");
                    console.log("3: Tie");
                    console.log("4: Player pair");
                    console.log("5: Banker pair");
                    return [4 /*yield*/, rl.question("Enter the number for your bet type: ")];
                case 2:
                    betTypeString = _a.sent();
                    switch (betTypeString.trim()) {
                        case '1':
                            betType = 'player';
                            break;
                        case '2':
                            betType = 'banker';
                            break;
                        case '3':
                            betType = 'tie';
                            break;
                        case '4':
                            betType = 'player pair';
                            break;
                        case '5':
                            betType = 'banker pair';
                            break;
                        default:
                            console.log("Invalid selection. Please enter a number from 1 to 5.");
                            return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 3]; // Valid bet type selected
                case 3:
                    if (!true) return [3 /*break*/, 5];
                    return [4 /*yield*/, rl.question("You have $".concat(player.balance, ". How much would you like to bet? "))];
                case 4:
                    betAmountString = _a.sent();
                    betAmount = parseInt(betAmountString, 10);
                    if (!isNaN(betAmount) && betAmount > 0 && betAmount <= player.balance) {
                        return [3 /*break*/, 5]; // Valid bet amount
                    }
                    else {
                        console.log("Invalid amount. Please enter a number between 1 and $".concat(player.balance, "."));
                    }
                    return [3 /*break*/, 3];
                case 5: return [2 /*return*/, { betAmount: betAmount, betType: betType }];
            }
        });
    });
}
function decideOutcome(playerValue, bankerValue, playerHand, bankerHand, betType) {
    return __awaiter(this, void 0, void 0, function () {
        var outcome, winnings;
        return __generator(this, function (_a) {
            outcome = '';
            winnings = 0;
            switch (betType) {
                case 'player':
                    if (playerValue > bankerValue) {
                        outcome = 'Win';
                        winnings = 2;
                    }
                    else {
                        outcome = 'Lose';
                    }
                    break;
                case 'banker':
                    if (bankerValue > playerValue) {
                        outcome = 'Win';
                        winnings = 1.95; // 5% commission
                    }
                    else {
                        outcome = 'Lose';
                    }
                    break;
                case 'tie':
                    if (playerValue === bankerValue) {
                        outcome = 'Win';
                        winnings = 8;
                    }
                    else {
                        outcome = 'Lose';
                    }
                    break;
                case 'player pair':
                    if (isPair(playerHand)) {
                        outcome = 'Win';
                        winnings = 11;
                    }
                    else {
                        outcome = 'Lose';
                    }
                    break;
                case 'banker pair':
                    if (isPair(bankerHand)) {
                        outcome = 'Win';
                        winnings = 11;
                    }
                    else {
                        outcome = 'Lose';
                    }
                    break;
                default:
                    outcome = 'Lose';
                    break;
            }
            return [2 /*return*/, { outcome: outcome, winnings: winnings }];
        });
    });
}
function startGame(player) {
    return __awaiter(this, void 0, void 0, function () {
        var playAgain, deck, banker, _a, betAmount, betType, playerValue, bankerValue, _b, outcome, winnings, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 8, 9, 11]);
                    playAgain = 'y';
                    _c.label = 1;
                case 1:
                    if (!(playAgain.toLowerCase() === 'y')) return [3 /*break*/, 7];
                    player.hand = [];
                    deck = (0, Deck_1.createBlackjackDeck)();
                    banker = (0, Player_1.createPerson)('Banker', '', 0);
                    banker.hand = [];
                    return [4 /*yield*/, getBets(player)];
                case 2:
                    _a = _c.sent(), betAmount = _a.betAmount, betType = _a.betType;
                    return [4 /*yield*/, dealCards(deck, player)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, dealCards(deck, banker)];
                case 4:
                    _c.sent();
                    console.log('Welcome to Baccarat!');
                    playerValue = calculateHandValue(player.hand);
                    bankerValue = calculateHandValue(banker.hand);
                    console.log("Player's hand: ".concat(player.hand.map(function (card) { return "".concat(card.value, " of ").concat(card.suit); }).join(', '), " (").concat(playerValue, ")"));
                    console.log("Banker's hand: ".concat(banker.hand.map(function (card) { return "".concat(card.value, " of ").concat(card.suit); }).join(', '), " (").concat(bankerValue, ")"));
                    return [4 /*yield*/, decideOutcome(playerValue, bankerValue, player.hand, banker.hand, betType)];
                case 5:
                    _b = _c.sent(), outcome = _b.outcome, winnings = _b.winnings;
                    if (outcome === 'Win') {
                        console.log("You win! Bet Type: ".concat(betType));
                        player.balance += betAmount * winnings;
                    }
                    else {
                        console.log("You lose! Bet Type: ".concat(betType));
                        player.balance -= betAmount;
                    }
                    console.log("Your new balance is $".concat(player.balance, "."));
                    if (player.balance <= 0) {
                        console.log("You've run out of funds! Game over.");
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, rl.question("Would you like to play again? (y/n): ")];
                case 6:
                    playAgain = _c.sent();
                    return [3 /*break*/, 1];
                case 7: return [3 /*break*/, 11];
                case 8:
                    error_1 = _c.sent();
                    console.error("An error occurred:", error_1);
                    return [3 /*break*/, 11];
                case 9:
                    console.log("Thank you for playing!");
                    return [4 /*yield*/, rl.close()];
                case 10:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.startGame = startGame;
startGame((0, Player_1.createPerson)('Player', '', 1000));
