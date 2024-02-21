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
var readline = require("readline");
var Color;
(function (Color) {
    Color["Red"] = "Red";
    Color["Black"] = "Black";
})(Color || (Color = {}));
var LowHigh;
(function (LowHigh) {
    LowHigh["Low"] = "Low";
    LowHigh["High"] = "High";
})(LowHigh || (LowHigh = {}));
var EvenOdd;
(function (EvenOdd) {
    EvenOdd["Even"] = "Even";
    EvenOdd["Odd"] = "Odd";
})(EvenOdd || (EvenOdd = {}));
// Global variable to keep track of all red numbers:
var redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18,
    19, 21, 23, 25, 27, 30, 32, 34, 36];
function areAdjacentNumbers(firstNumber, secondNumber) {
    var booleans = false;
    var difference = firstNumber - secondNumber;
    if (Math.abs(difference) < 3) {
        booleans = true;
    }
    if ((firstNumber % 3) === (secondNumber % 3)) {
        booleans = true;
    }
    return booleans;
}
function read_user_input(prompt, max) {
    return __awaiter(this, void 0, void 0, function () {
        var rl, koll, retur;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    koll = true;
                    return [4 /*yield*/, new Promise(function (resolve) {
                            rl.question(prompt, function (answer) {
                                rl.close();
                                resolve(answer);
                                if (answer === "x" || answer === "X") {
                                    process.exit();
                                }
                                if (!check(answer, max)) {
                                    koll = false;
                                    console.log("HELLO");
                                }
                            });
                        })];
                case 1:
                    retur = _a.sent();
                    console.log("JDPOSJPODSJPODSJPO");
                    return [2 /*return*/, koll ? retur : read_user_input(prompt, max)];
            }
        });
    });
}
function check(answer, max) {
    for (var i = 1; i < max + 1; i++) {
        if (answer === i.toString()) {
            return true;
        }
    }
    return false;
}
function print_options(options) {
    for (var _i = 0, _a = Object.entries(options); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        console.log("".concat(key, ") ").concat(value));
    }
}
function playerMove(person) {
    return __awaiter(this, void 0, void 0, function () {
        var options, userInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // could add print_options from login
                    console.log(person.name);
                    options = "1. numbers bet (single, split, street, corner, doublestreet)\n2. even bets (RedBlack, EvenOdd, LowHigh)\n3. Columns or dozens\n";
                    return [4 /*yield*/, read_user_input(options, 3)];
                case 1:
                    userInput = _a.sent();
                    console.log(userInput);
                    if (!(userInput === "1")) return [3 /*break*/, 2];
                    numberBet();
                    return [3 /*break*/, 5];
                case 2:
                    if (!(userInput === "2")) return [3 /*break*/, 3];
                    evenBets();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, columnsAndDozensBet(["", 0, []])];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: 
                // place bets and register bets
                return [4 /*yield*/, addBetAmount()];
                case 6:
                    // place bets and register bets
                    _a.sent();
                    return [4 /*yield*/, read_user_input("want to bet more?: Yes(1) or No(2)\n", 2)];
                case 7:
                    userInput = _a.sent();
                    if (userInput === "1") {
                        // spin the wheel and call the calculatewinnings functions and register the payout to the account
                        playerMove(person);
                    }
                    else { }
                    return [2 /*return*/];
            }
        });
    });
}
function numberBet() {
}
function evenBets() {
}
function columnsAndDozensBet(bet) {
    return __awaiter(this, void 0, void 0, function () {
        var inp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read_user_input("Choose columns (1) or dozens (2)\n", 2)];
                case 1:
                    inp = _a.sent();
                    if (!(inp === "1")) return [3 /*break*/, 3];
                    return [4 /*yield*/, read_user_input("Choose column 1: (1,4,7,10,...,34)\n" +
                            "Choose column 2: (2,5,8,11,...,35)\n" +
                            "Choose column 3: (3,6,9,12,...,36)\n", 3)];
                case 2:
                    //columns
                    inp = _a.sent();
                    if (inp === "1") {
                        bet[0] = 1;
                    }
                    else if (inp === "2") {
                        bet[0] = 2;
                    }
                    else if (inp === "3") {
                        bet[0] = 3;
                    }
                    else { }
                    return [3 /*break*/, 5];
                case 3:
                    if (!(inp === "2")) return [3 /*break*/, 5];
                    return [4 /*yield*/, read_user_input("Choose dozen 1: (1-12)\n" +
                            "Choose dozen 2: (13-24)\n" +
                            "Choose dozen 3: (25-36)\n", 3)];
                case 4:
                    //dozens
                    inp = _a.sent();
                    if (inp === "1") {
                        bet[0] = 4;
                    }
                    else if (inp === "2") {
                        bet[0] = 5;
                    }
                    else if (inp === "3") {
                        bet[0] = 6;
                    }
                    else {
                    }
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function addBetAmount() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
/**
 * Calculates the total winnings for a player based on their bets placed
 * and the winning number each time.
 * @param bets An array of bets placed, where each bet is
 *             represented by [BetType, stake, number[]].
 * @param number The winning number in the roulette game.
 * @returns The total payout amount.
 */
function calculateWinnings(bets, number) {
    var payout = 0;
    for (var i = 0; i < bets.length; i++) {
        payout += calcPayout(bets[i], number);
    }
    return payout;
}
/**
 * Calculates the payout based on the type of bet and winning number.
 * @param bet An array of bets placed, where each bet is
 *            represented by [BetType, stake, number[]].
 * @param number The winning number in the roulette game.
 * @returns The calculated payout amount.
 */
function calcPayout(bet, number) {
    var typeOfBet = bet[0];
    return typeOfBet === "Single" ? calcSingle(bet[2], bet[1], number) :
        typeOfBet === "Split" ? calcSplit(bet[2], bet[1], number) :
            typeOfBet === "Street" ? calcStreet(bet[2], bet[1], number) :
                typeOfBet === "Corner" ? calcCorner(bet[2], bet[1], number) :
                    typeOfBet === "DoubleStreet" ? calcDoubleStreet(bet[2], bet[1], number) :
                        typeOfBet === ("Red" || "Black") ? calcRedOrBlack(typeOfBet, bet[1], number) :
                            typeOfBet === ("Even" || "Odd") ? calcEvenOrOdd(typeOfBet, bet[1], number) :
                                typeOfBet === ("Low" || "High") ? calcLowOrHigh(typeOfBet, bet[1], number) :
                                    typeOfBet === (1 || 2 || 3) ? calcColumns(typeOfBet, bet[1], number) :
                                        typeOfBet === (4 || 5 || 6) ? calcDozens(typeOfBet, bet[1], number) :
                                            0;
}
/**
 * Calculates the payout for a bet on a single number.
 * @param bet An array of bets placed, where each bet is
 *            represented by [BetType, stake, number[]].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcSingle(bet, stake, number) {
    return bet[0] === number ? stake * 36 : 0;
}
/**
 * Calculates the payout for a bet on two adjacent numbers.
 * @param bet An array of bets placed, where each bet is
 *            represented by [BetType, stake, number[]].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcSplit(bet, stake, number) {
    return bet[0] === number ? stake * 18 : bet[1] === number ? stake * 18 : 0;
}
/**
 * Calculates the payout for a bet on a street. This is three consecutive
 *  numbers in a horizontal line.
 * @param bet An array of bets placed, where each bet is
 *            represented by [BetType, stake, number[]].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcStreet(bet, stake, number) {
    return (number >= bet[0] && number <= bet[0] + 3) ? stake * 12 : 0;
}
/**
 * Calculates the payout for a bet on a corner. This is when four numbers meet
 * at one corner.
 * @param bet An array of bets placed, where each bet is
 *            represented by [BetType, stake, number[]].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcCorner(bet, stake, number) {
    return (number >= bet[0] && number <= bet[0] + 4) ? stake * 8 : 0;
}
/**
 * Calculates the payout for a bet placed on a double street. This is six
 * consecutive numbers that form two horizontal lines.
 * @param bet An array of bets placed, where each bet is
 *            represented by [BetType, stake, number[]].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcDoubleStreet(bet, stake, number) {
    return (number >= bet[0] && number <= bet[0] + 5) ? stake * 6 : 0;
}
/**
 * Calculates the payout for a bet placed on either red or black.
 * @param redOrBlack The color selected for the bet.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcRedOrBlack(redOrBlack, stake, number) {
    if (redOrBlack === Color.Red) {
        if (redNumbers.includes(number)) {
            return stake * 2;
        }
        else {
            return 0;
        }
    }
    else {
        if (!redNumbers.includes(number)) {
            return stake * 2;
        }
        else {
            return 0;
        }
    }
}
/**
 * Calculates the payout for a bet placed on either even or odd.
 * @param evenOrOdd The type of selection for the bet, either even or odd.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcEvenOrOdd(evenOrOdd, stake, number) {
    if (evenOrOdd === EvenOdd.Even) {
        if (number % 2 === 0) {
            return stake * 2;
        }
        else {
            return 0;
        }
    }
    else {
        if (number % 2 === 1) {
            return stake * 2;
        }
        else {
            return 0;
        }
    }
}
/**
 * Calculates the payout for a bet placed on either low or high.
 * @param lowOrHigh The range of selection for the bet, either low or high.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcLowOrHigh(lowOrHigh, stake, number) {
    if (lowOrHigh === LowHigh.Low) {
        if (number <= 18) {
            return stake * 2;
        }
        else {
            return 0;
        }
    }
    else {
        if (number >= 19) {
            return stake * 2;
        }
        else {
            return 0;
        }
    }
}
/**
 * Calculates the payout for a bet placed on a column.
 * @param column The column selected for the bet.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcColumns(column, stake, number) {
    if ((number - column) % 3 === 0) {
        return stake * 3;
    }
    else {
        return 0;
    }
}
/**
 * Calculates the payout for a bet placed on a dozen.
 * @param column The dozen selected for the bet.
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
playerMove({ name: "Viktor", password: "HIDSIODSHDHIOS", balance: 2000, hand: [] });
