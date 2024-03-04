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
exports.calcDozens = exports.calcColumns = exports.calcLowOrHigh = exports.calcEvenOrOdd = exports.calcRedOrBlack = exports.calcDoubleStreet = exports.calcCorner = exports.calcStreet = exports.calcSplit = exports.calcSingle = exports.calcPayout = exports.calculateWinnings = exports.columnsAndDozensBet = exports.evenBets = exports.numberBet = exports.buildABet = exports.addBetAmount = exports.spin = exports.playerMove = exports.computerMove = exports.startGame = exports.EvenOdd = exports.LowHigh = exports.Color = void 0;
var readUserInput_1 = require("../../Utilities/userInput/readUserInput");
var list_1 = require("../../Utilities/list");
var Color;
(function (Color) {
    Color["Red"] = "Red";
    Color["Black"] = "Black";
})(Color || (exports.Color = Color = {}));
var LowHigh;
(function (LowHigh) {
    LowHigh["Low"] = "Low";
    LowHigh["High"] = "High";
})(LowHigh || (exports.LowHigh = LowHigh = {}));
var EvenOdd;
(function (EvenOdd) {
    EvenOdd["Even"] = "Even";
    EvenOdd["Odd"] = "Odd";
})(EvenOdd || (exports.EvenOdd = EvenOdd = {}));
// Global variable to keep track of all red numbers:
var redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18,
    19, 21, 23, 25, 27, 30, 32, 34, 36];
var streets = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12],
    [13, 14, 15], [16, 17, 18], [19, 20, 21], [22, 23, 24],
    [25, 26, 27], [28, 29, 30], [31, 32, 33], [34, 35, 36]];
/**
 * Acts as the game loop for roulette.
 * @param person The player represented as a Person object.
 * @param allBets All bets that the player has chosen before the spin
 * which is set to empty at the start of the game
 */
function startGame(person, allBets) {
    if (allBets === void 0) { allBets = (0, list_1.empty_list)(); }
    return __awaiter(this, void 0, void 0, function () {
        var before, prompt_1, userInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 5];
                    if (!(person.balance === 0)) return [3 /*break*/, 1];
                    console.log("UNFORTUNATELY YOU'RE OUT OF FUNDS COME BACK LATER");
                    return [3 /*break*/, 5];
                case 1:
                    console.log("WELCOME TO ROULETTE YOU HAVE " +
                        person.balance.toString() + " DOLLARS");
                    before = person.balance;
                    return [4 /*yield*/, playerMove(person, allBets)];
                case 2:
                    _a.sent();
                    computerMove(person, before, allBets);
                    prompt_1 = "Want to play more?: Yes(1) or No(2)\n";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(prompt_1, 2)];
                case 3:
                    userInput = _a.sent();
                    if (userInput === "1") {
                        allBets = (0, list_1.empty_list)();
                    }
                    else {
                        return [3 /*break*/, 5];
                    }
                    _a.label = 4;
                case 4: return [3 /*break*/, 0];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.startGame = startGame;
/**
 * Manages all logic needed for the actions to be taken between
 * player moves
 * @param person The player represented as a Person object.
 * @param before amount of money the player had before playing
 * @param allBets a list of bets submitted by the player
 */
function computerMove(person, before, allBets) {
    // Spin the wheel and call the calculatewinnings functions 
    // and register the payout to the account
    var winningNumber = spin();
    console.log("WINNING NUMBER IS: " + winningNumber);
    console.log();
    var winnings = calculateWinnings(allBets, winningNumber);
    person.balance += winnings;
    var delta = person.balance - before;
    var str = delta > 0
        ? "YOU WON " + delta + " DOLLARS"
        : delta < 0
            ? "YOU LOST " + Math.abs(delta) + " DOLLARS"
            : "YOU BROKE EVEN";
    console.log(str);
    console.log("Balance after: ", person.balance);
}
exports.computerMove = computerMove;
/**
 * Manages the player's move in the roulette game.
 * @param person The player represented as a Person object.
 * @param allBets a list of bets submitted by the player
 */
function playerMove(person, allBets) {
    return __awaiter(this, void 0, void 0, function () {
        var stake, bet, prompt, userInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("YOU HAVE " + person.balance + " DOLLARS TO BET WITH");
                    return [4 /*yield*/, addBetAmount(person)];
                case 1:
                    stake = _a.sent();
                    return [4 /*yield*/, buildABet(stake)];
                case 2:
                    bet = _a.sent();
                    // place bets and register bets
                    allBets = (0, list_1.pair)(bet, allBets);
                    console.log("YOUR BET: ", bet);
                    console.log("ALL BETS: ", (0, list_1.to_string)(allBets));
                    prompt = "Want to add a bet?: Yes(1) or No(2)\n";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(prompt, 2)];
                case 3:
                    userInput = _a.sent();
                    if (!(userInput === "1")) return [3 /*break*/, 5];
                    return [4 /*yield*/, playerMove(person, allBets)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.playerMove = playerMove;
/**
 * randomizes a number between 0-36 and returns it
 * @return number between 0 and 36
 */
function spin() {
    return Math.floor(Math.random() * 37);
}
exports.spin = spin;
/**
 * Prompts the player to input the amount of money they would like to bet
 * and then removes that amount from their wallet balance.
 * @param person The player represented as a Person object.
 * @returns
 */
function addBetAmount(person) {
    return __awaiter(this, void 0, void 0, function () {
        var userInput, stake;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, readUserInput_1.readUserInput)("How much would you like to bet? \n", person.balance)];
                case 1:
                    userInput = _a.sent();
                    stake = Number(userInput);
                    person.balance -= stake;
                    return [2 /*return*/, stake];
            }
        });
    });
}
exports.addBetAmount = addBetAmount;
/**
 * Prompts the player to build a bet of their choice by
 * selecting the type of bet and returns it
 * @param stake amount of money betted by the player
 * @returns bet
 */
function buildABet(stake) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt, userInput, bet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n---------BUILD A BET----------\n");
                    prompt = "1. Numbers bet (single, split, street, corner, doublestreet)" +
                        "\n2. Even bets (RedBlack, EvenOdd, LowHigh)" +
                        "\n3. Columns or dozens\n";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(prompt, 3)];
                case 1:
                    userInput = _a.sent();
                    bet = ["", stake, []];
                    if (!(userInput === "1")) return [3 /*break*/, 3];
                    return [4 /*yield*/, numberBet(bet)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 3:
                    if (!(userInput === "2")) return [3 /*break*/, 5];
                    return [4 /*yield*/, evenBets(bet)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, columnsAndDozensBet(bet)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/, bet];
            }
        });
    });
}
exports.buildABet = buildABet;
/**
 * Prompts the player to build a numbers bet
 * (single, split, street, corner, doublestreet).
 * @param bet The bet details according to the bet type.
 */
function numberBet(bet) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt, inp, amount, first, numbers, str, moved, i, second, first, second, first;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prompt = "Choose: zero (1), single (2), split (3), street (4), " +
                        "corner (5) or doublestreet (6)\n";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(prompt, 6)];
                case 1:
                    inp = _a.sent();
                    if (!(inp === "1")) return [3 /*break*/, 2];
                    bet[0] = "Single";
                    bet[2][0] = 0;
                    return [3 /*break*/, 22];
                case 2:
                    if (!(inp === "2")) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose number: ", 36)];
                case 3:
                    // Single
                    inp = _a.sent();
                    bet[0] = "Single";
                    bet[2][0] = Number(inp);
                    return [3 /*break*/, 22];
                case 4:
                    if (!(inp === "3")) return [3 /*break*/, 7];
                    amount = 0;
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose first number: ", 36)];
                case 5:
                    inp = _a.sent();
                    bet[0] = "Split";
                    first = Number(inp);
                    bet[2][0] = first;
                    numbers = [];
                    // check line to ensure right amount of adjacent numbers
                    if (first % 3 === 0) {
                        // Highest line
                        amount = numbers.push(first - 1, first + 3, first - 3);
                    }
                    else if (first % 3 === 1) {
                        // Lowest line
                        amount = numbers.push(first + 1, first + 3, first - 3);
                    }
                    else {
                        // Middle line
                        amount = numbers.push(first - 1, first + 1, first + 3, first - 3);
                    }
                    str = "Choose second number: ";
                    moved = 0;
                    for (i = 0; i < amount; i++) {
                        if (numbers[i] < 1 || numbers[i] > 36) {
                            moved++;
                        }
                        else {
                            str += "nr: " + numbers[i].toString() +
                                " (" + (i - moved + 1).toString() + "), ";
                        }
                    }
                    str += "\n";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(str, amount)];
                case 6:
                    inp = _a.sent();
                    second = Number(inp);
                    bet[2][1] = numbers[second - 1] === -1
                        ? numbers[second]
                        : numbers[second - 1];
                    console.log(bet[2]);
                    return [3 /*break*/, 22];
                case 7:
                    if (!(inp === "4")) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose street: (1-12): \n", 12)];
                case 8:
                    // Street 
                    inp = _a.sent();
                    bet[0] = "Street";
                    bet[2][0] = Number(inp);
                    return [3 /*break*/, 22];
                case 9:
                    if (!(inp === "5")) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose first number: \n", 36)];
                case 10:
                    // Corner
                    inp = _a.sent();
                    bet[0] = "Corner";
                    first = Number(inp);
                    second = void 0;
                    if (!(first - 3 < 1)) return [3 /*break*/, 11];
                    // Go right
                    second = first + 3;
                    return [3 /*break*/, 14];
                case 11:
                    if (!(first + 3 > 36)) return [3 /*break*/, 12];
                    // Go left
                    second = first - 3;
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Go left to " + (first - 3).toString() +
                        " (1) or right to " +
                        (first + 3).toString() + " (2): \n", 2)];
                case 13:
                    inp = _a.sent();
                    second = Number(inp) === 1 ? first - 3 : first + 3;
                    _a.label = 14;
                case 14: return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Go up (1): (" + (first).toString() + "," +
                        (first - 1).toString() + "," +
                        (second - 1).toString() + "," +
                        (second).toString() + ")" + " or down (2): (" +
                        (first).toString() + "," +
                        (first + 1).toString() + "," +
                        (second + 1).toString() + "," +
                        (second).toString() + "): \n", 2)];
                case 15:
                    // Up (first, first - 1, second, second - 1)
                    // Down (first, first + 1, second, second + 1)
                    inp = _a.sent();
                    bet[2] = Number(inp) === 1
                        ? [first, first - 1, second, second - 1]
                        : [first, first + 1, second, second + 1];
                    return [3 /*break*/, 22];
                case 16:
                    if (!(inp === "6")) return [3 /*break*/, 22];
                    // Doublestreet
                    bet[0] = "DoubleStreet";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose first street (1-12):\n", 12)];
                case 17:
                    inp = _a.sent();
                    first = Number(inp);
                    bet[2][0] = first;
                    if (!(first - 1 === 0)) return [3 /*break*/, 18];
                    console.log("SECOND STREETNR IS 2");
                    inp = (2).toString();
                    return [3 /*break*/, 21];
                case 18:
                    if (!(first + 1 === 13)) return [3 /*break*/, 19];
                    console.log("SECOND STREETNR IS 11");
                    inp = (1).toString();
                    return [3 /*break*/, 21];
                case 19: return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose second street: street " +
                        (first - 1).toString() + " (1) or street " +
                        (first + 1).toString() + " (2):\n", 2)];
                case 20:
                    inp = _a.sent();
                    _a.label = 21;
                case 21:
                    bet[2][1] = Number(inp) === 1 ? first - 1 : first + 1;
                    return [3 /*break*/, 22];
                case 22: return [2 /*return*/];
            }
        });
    });
}
exports.numberBet = numberBet;
/**
 * Prompts the player to build an bet that is of the
 * category even bets (RedBlack, EvenOdd, LowHigh).
 * @param bet The bet details according to the bet type.
 */
function evenBets(bet) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt, inp, red, black;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prompt = "Choose red/black (1), even/odd (2) or low/high (3)\n";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)(prompt, 3)];
                case 1:
                    inp = _a.sent();
                    if (!(inp === "1")) return [3 /*break*/, 3];
                    red = "(1, 3, 5, 7, 9, 12, 14, 16, 18, 19," +
                        " 21, 23, 25, 27, 30, 32, 34, 36)";
                    black = "(2, 4, 6, 8, 10, 11, 13, 15, 17, 20," +
                        " 22, 24, 26, 28, 29, 31, 33, 35)";
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose red numbers (1): \n" + red + "\n" +
                            "Choose black number (2): \n" + black + "\n", 2)];
                case 2:
                    inp = _a.sent();
                    if (inp === "1") {
                        bet[0] = Color.Red;
                    }
                    else if (inp === "2") {
                        bet[0] = Color.Black;
                    }
                    else { }
                    return [3 /*break*/, 7];
                case 3:
                    if (!(inp === "2")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose even numbers (1): \n" +
                            "Choose odd numbers (2): \n", 2)];
                case 4:
                    // Even/Odd
                    inp = _a.sent();
                    if (inp === "1") {
                        bet[0] = EvenOdd.Even;
                    }
                    else if (inp === "2") {
                        bet[0] = EvenOdd.Odd;
                    }
                    else { }
                    return [3 /*break*/, 7];
                case 5:
                    if (!(inp === "3")) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose low numbers (1): (1-18)\n" +
                            "Choose odd numbers (2): (19-36)\n", 2)];
                case 6:
                    // Low/High
                    inp = _a.sent();
                    if (inp === "1") {
                        bet[0] = LowHigh.Low;
                    }
                    else if (inp === "2") {
                        bet[0] = LowHigh.High;
                    }
                    else { }
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.evenBets = evenBets;
/**
 * Prompts the player to build a columns or dozens bet.
 * @param bet The bet details according to the bet type.
 */
function columnsAndDozensBet(bet) {
    return __awaiter(this, void 0, void 0, function () {
        var inp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose columns (1) or dozens (2): \n", 2)];
                case 1:
                    inp = _a.sent();
                    if (!(inp === "1")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose column 1: (1,4,7,10,...,34)\n" +
                            "Choose column 2: (2,5,8,11,...,35)\n" +
                            "Choose column 3: (3,6,9,12,...,36)\n", 3)];
                case 2:
                    // Columns
                    inp = _a.sent();
                    if (inp === "1") {
                        bet[0] = 1;
                    }
                    else if (inp === "2") {
                        bet[0] = 2;
                    }
                    else if (inp === "3") { //This line 
                        bet[0] = 3;
                    }
                    else { }
                    return [3 /*break*/, 5];
                case 3:
                    if (!(inp === "2")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Choose dozen 1: (1-12)\n" +
                            "Choose dozen 2: (13-24)\n" +
                            "Choose dozen 3: (25-36)\n", 3)];
                case 4:
                    // Dozens
                    inp = _a.sent();
                    if (inp === "1") {
                        bet[0] = 4;
                    }
                    else if (inp === "2") {
                        bet[0] = 5;
                    }
                    else if (inp === "3") { //This line
                        bet[0] = 6;
                    }
                    else { }
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.columnsAndDozensBet = columnsAndDozensBet;
/**
 * Calculates the total winnings for a player based on their bets placed
 * and the winning number each time.
 * @param bets A list of bets placed, where each bet is
 *             represented by [BetType, stake, Array<number>].
 * @param number The winning number in the roulette game.
 * @returns The total payout amount.
 */
function calculateWinnings(bets, number) {
    if ((0, list_1.is_null)(bets)) {
        return 0;
    }
    else {
        return calcPayout((0, list_1.head)(bets), number) +
            calculateWinnings((0, list_1.tail)(bets), number);
    }
}
exports.calculateWinnings = calculateWinnings;
/**
 * Calculates the payout based on the type of bet and winning number.
 * @param bet An array of bets placed, where each bet is
 *            represented by [BetType, stake, Array<number>].
 * @param number The winning number in the roulette game.
 * @returns The calculated payout amount.
 */
function calcPayout(bet, number) {
    var typeOfBet = bet[0];
    return typeOfBet === "Single"
        ? calcSingle(bet[2], bet[1], number)
        : typeOfBet === "Split"
            ? calcSplit(bet[2], bet[1], number)
            : typeOfBet === "Street"
                ? calcStreet(bet[2][0], bet[1], number)
                : typeOfBet === "Corner"
                    ? calcCorner(bet[2], bet[1], number)
                    : typeOfBet === "DoubleStreet"
                        ? calcDoubleStreet(bet[2], bet[1], number)
                        : typeOfBet === ("Red" || "Black")
                            ? calcRedOrBlack(typeOfBet, bet[1], number)
                            : typeOfBet === ("Even" || "Odd")
                                ? calcEvenOrOdd(typeOfBet, bet[1], number)
                                : typeOfBet === ("Low" || "High")
                                    ? calcLowOrHigh(typeOfBet, bet[1], number)
                                    : typeOfBet === (1 || 2 || 3)
                                        ? calcColumns(typeOfBet, bet[1], number)
                                        : typeOfBet === (4 || 5 || 6)
                                            ? calcDozens(typeOfBet, bet[1], number)
                                            : 0;
}
exports.calcPayout = calcPayout;
/**
 * Calculates the payout for a bet on a single number.
 * @param bet Array of numbers betted on.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcSingle(bet, stake, number) {
    return bet[0] === number ? stake * 36 : 0;
}
exports.calcSingle = calcSingle;
/**
 * Calculates the payout for a split bet placed on two adjacent numbers.
 * This function validates that the bet is placed on numbers within the
 * valid range (1-36) and that the numbers are adjacent on the roulette table.
 * It returns the payout amount if one of the bet numbers matches the winning
 * number and the bet is valid.
 * @param bet An array containing two valid numbers on which the split bet is placed.
 * @param stake The amount of money staked on the bet.
 * @param number The winning number of the roulette spin.
 * @returns The payout amount if the bet wins, otherwise 0.
 */
function calcSplit(bet, stake, number) {
    // Validate numbers are within the roulette table range
    if (bet.some(function (num) { return num < 1 || num > 36; })) {
        return 0; // No payout for numbers outside the valid range
    }
    // Check if the bet numbers are adjacent on the roulette table
    var isAdjacent = Math.abs(bet[0] - bet[1]) === 1 ||
        Math.abs(bet[0] - bet[1]) === 3;
    if (!isAdjacent) {
        return 0; // No payout for non-adjacent numbers
    }
    // Calculate and return payout if bet wins
    return bet.includes(number) ? stake * 18 : 0;
}
exports.calcSplit = calcSplit;
/**
 * Calculates the payout for a bet on a street. This is three consecutive
 *  numbers in a horizontal line.
 * @param index index pointing to a place in street array
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcStreet(index, stake, number) {
    return (streets[index].includes(number)) ? stake * 12 : 0;
}
exports.calcStreet = calcStreet;
/**
 * Calculates the payout for a bet on a corner. This is when four numbers meet
 * at one corner.
 * @param bet Array consisting of numbers betted on.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcCorner(bet, stake, number) {
    return (bet.includes(number)) ? stake * 8 : 0;
}
exports.calcCorner = calcCorner;
/**
 * Calculates the payout for a bet placed on a double street. This is six
 * consecutive numbers that form two horizontal lines.
 * @param indexes An array of indexes each pointing to an index in the street array.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcDoubleStreet(indexes, stake, number) {
    var ret = 0;
    indexes.forEach(function (index) {
        ret += calcStreet(index, stake, number);
    });
    return ret / 2;
}
exports.calcDoubleStreet = calcDoubleStreet;
/**
 * Calculates the payout for a bet placed on either red or black numbers
 * and returns a payout based on whether the winning number
 * matches the bet's color selection.
 * @param redOrBlack - The color selected for the bet (Red or Black).
 * @param stake - The amount of stake placed on the bet.
 * @param number - The winning number in the roulette game.
 * @returns The payout for the placed bet if it wins, otherwise 0.
 */
function calcRedOrBlack(redOrBlack, stake, number) {
    if (redOrBlack === Color.Red) {
        return redNumbers.includes(number) ? stake * 2 : 0;
    }
    else {
        return !redNumbers.includes(number) ? stake * 2 : 0;
    }
}
exports.calcRedOrBlack = calcRedOrBlack;
/**
 * Calculates the payout for a bet placed on either even or odd numbers.
 * Special consideration is given to the number 0, which is neither even nor odd.
 * @param evenOrOdd - The type of selection for the bet (Even or Odd).
 * @param stake - The amount of stake placed on the bet.
 * @param number - The winning number in the roulette game.
 * @returns The payout for the placed bet if it wins, otherwise 0.
 */
function calcEvenOrOdd(evenOrOdd, stake, number) {
    if (number === 0) {
        return 0;
    }
    if (evenOrOdd === EvenOdd.Even) {
        return number % 2 === 0 ? stake * 2 : 0;
    }
    else {
        return number % 2 !== 0 ? stake * 2 : 0;
    }
}
exports.calcEvenOrOdd = calcEvenOrOdd;
/**
 * Calculates the payout for a bet placed on either low or high.
 * @param lowOrHigh The range of selection for the bet, either low or high.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcLowOrHigh(lowOrHigh, stake, number) {
    if (lowOrHigh === LowHigh.Low) {
        if (number <= 18 && number > 0) {
            return stake * 2;
        }
        else {
            return 0;
        }
    }
    else {
        if (number >= 19 && number > 0) {
            return stake * 2;
        }
        else {
            return 0;
        }
    }
}
exports.calcLowOrHigh = calcLowOrHigh;
/**
 * Calculates the payout for a bet placed on a column.
 * @param column The column selected for the bet.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcColumns(column, stake, number) {
    if ((number - column) % 3 === 0 && number > 0) {
        return stake * 3;
    }
    else {
        return 0;
    }
}
exports.calcColumns = calcColumns;
/**
 * Calculates the payout for a bet placed on a dozen.
 * @param dozens The dozen selected for the bet.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcDozens(dozens, stake, number) {
    // To match the indexes of the dozens.
    dozens -= 3;
    if (dozens === 1) {
        if (number <= 12) {
            return stake * 3;
        }
        else {
            return 0;
        }
    }
    else if (dozens === 2) {
        if (13 <= number && number <= 24) {
            return stake * 3;
        }
        else {
            return 0;
        }
    }
    else {
        if (number >= 25) {
            return stake * 3;
        }
        else {
            return 0;
        }
    }
}
exports.calcDozens = calcDozens;
