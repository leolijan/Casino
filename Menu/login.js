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
exports.menu = exports.readLoginCredentials = exports.writeLoginCredentials = exports.newUser = exports.login = exports.loggedIn = void 0;
var fs = require("fs");
var Baccarat_1 = require("../Card Games/Baccarat/Baccarat");
var Blackjack_1 = require("../Card Games/Blackjack/Blackjack");
var roulette_1 = require("../Card Games/Roulette/roulette");
var readUserInput_1 = require("../userInput/readUserInput");
// Global variable
var textfile = "user_information.json";
function splashScreen() {
    var logo = "\n            \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n          \u2588\u2588                                   \u2588\u2588\n        \u2588\u2588                \uD835\uDE44\uD835\uDE4F\uD835\uDE3E\uD835\uDE56\uD835\uDE68\uD835\uDE5E\uD835\uDE63\uD835\uDE64                \u2588\u2588\n          \u2588\u2588                                   \u2588\u2588\n            \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n            ";
    console.log(logo);
}
function printOptions(options) {
    for (var _i = 0, _a = Object.entries(options); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        console.log("".concat(key, ") ").concat(value));
    }
}
function loggedIn(user) {
    return __awaiter(this, void 0, void 0, function () {
        var all_users, options, choice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    all_users = readLoginCredentials(textfile);
                    options = {
                        "1": "Blackjack",
                        "2": "Baccarat",
                        "3": "Roulette",
                        "4": "Add Money",
                        "5": "Log Out"
                    };
                    printOptions(options);
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Option: ", 4)];
                case 1:
                    choice = _a.sent();
                    console.log(); // Add a newline for better formatting
                    if (!(choice === "1")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, Blackjack_1.startGame)(all_users[user])];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 3:
                    if (!(choice === "2")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, Baccarat_1.startGame)(all_users[user])];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 5:
                    if (!(choice === "3")) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, roulette_1.playerMove)(all_users[user])];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 7:
                    if (!(choice === "4")) return [3 /*break*/, 9];
                    return [4 /*yield*/, insert_money(user, all_users)];
                case 8:
                    _a.sent(); // Call insert_money here
                    return [3 /*break*/, 10];
                case 9:
                    if (choice === "5") {
                        console.log("Logging out...");
                        return [2 /*return*/]; // Exit the loggedIn function to log out
                    }
                    _a.label = 10;
                case 10:
                    writeLoginCredentials(textfile, all_users); // Save after any operation
                    return [4 /*yield*/, loggedIn(user)];
                case 11:
                    _a.sent(); // Re-display the logged-in menu options
                    return [2 /*return*/];
            }
        });
    });
}
exports.loggedIn = loggedIn;
function insert_money(username, all_users) {
    return __awaiter(this, void 0, void 0, function () {
        var moneyOptions, choice, amount, customAmountStr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Select the amount of money to insert:");
                    moneyOptions = {
                        "1": "100",
                        "2": "200",
                        "3": "500",
                        "4": "1000",
                        "5": "Enter a custom amount"
                    };
                    printOptions(moneyOptions);
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Option (or 'X' to cancel): ", 5)];
                case 1:
                    choice = _a.sent();
                    if (choice.toLowerCase() === 'x') {
                        console.log("Money insertion cancelled.");
                        return [2 /*return*/];
                    }
                    amount = 0;
                    if (!(choice === "5")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInputBasic)("Enter your custom amount: ")];
                case 2:
                    customAmountStr = _a.sent();
                    amount = parseFloat(customAmountStr);
                    if (isNaN(amount) || amount <= 0) {
                        console.log("Invalid amount.");
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    if (moneyOptions.hasOwnProperty(choice)) {
                        amount = parseFloat(moneyOptions[choice]);
                    }
                    else {
                        console.log("Invalid option selected.");
                        return [2 /*return*/];
                    }
                    _a.label = 4;
                case 4:
                    all_users[username].balance += amount;
                    console.log("$".concat(amount, " has been added to your account. Your new balance is $").concat(all_users[username].balance, "."));
                    return [2 /*return*/];
            }
        });
    });
}
function login(users) {
    return __awaiter(this, void 0, void 0, function () {
        var username, password;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInputBasic)("Username: ")];
                case 1:
                    username = _a.sent();
                    return [4 /*yield*/, (0, readUserInput_1.readUserInputBasic)("Password: ")];
                case 2:
                    password = _a.sent();
                    if (!(users[username] && password === users[username].password)) return [3 /*break*/, 4];
                    console.log("Welcome ".concat(username));
                    return [4 /*yield*/, loggedIn(username)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    console.log();
                    console.log("Invalid username or password");
                    console.log("Please try again or choose another option.");
                    return [4 /*yield*/, menu()];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 0];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.login = login;
function newUser() {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, confirmedPassword, all_users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInputBasic)("Choose your username: ")];
                case 1:
                    username = _a.sent();
                    return [4 /*yield*/, (0, readUserInput_1.readUserInputBasic)("Choose your password: ")];
                case 2:
                    password = _a.sent();
                    return [4 /*yield*/, (0, readUserInput_1.readUserInputBasic)("Confirm your password: ")];
                case 3:
                    confirmedPassword = _a.sent();
                    if (password === confirmedPassword) {
                        all_users = readLoginCredentials(textfile);
                        if (all_users[username]) {
                            console.log("Username already exists. Choose a different username.");
                            return [3 /*break*/, 0];
                        }
                        all_users[username] = {
                            name: username,
                            password: confirmedPassword,
                            balance: 1000, // Default starting balance
                            hand: [] // Empty hand at the start
                        };
                        writeLoginCredentials(textfile, all_users);
                        console.log("Registration successful");
                        return [3 /*break*/, 4];
                    }
                    else {
                        console.log("The two passwords are not identical");
                        console.log("Try again!");
                        console.log();
                    }
                    return [3 /*break*/, 0];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.newUser = newUser;
function writeLoginCredentials(filename, users) {
    try {
        var data = JSON.stringify(users, null, 2);
        fs.writeFileSync(filename, data);
    }
    catch (err) {
        console.error("An error occurred: ".concat(err));
    }
}
exports.writeLoginCredentials = writeLoginCredentials;
function readLoginCredentials(filename) {
    try {
        var data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    }
    catch (err) {
        console.error("Error reading the file: ".concat(err));
        fs.writeFileSync(filename, '{}');
        return {};
    }
}
exports.readLoginCredentials = readLoginCredentials;
function menu() {
    return __awaiter(this, void 0, void 0, function () {
        var all_users_saved, menu_options, user_input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    splashScreen();
                    console.log();
                    all_users_saved = readLoginCredentials(textfile);
                    menu_options = { "1": "Login",
                        "2": "Register",
                        "3": "Quit" };
                    printOptions(menu_options);
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Option: ", 3)];
                case 1:
                    user_input = _a.sent();
                    console.log(); // Add a newline for better formatting
                    if (!(user_input === "1")) return [3 /*break*/, 3];
                    return [4 /*yield*/, login(all_users_saved)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 3:
                    if (!(user_input === "2")) return [3 /*break*/, 6];
                    return [4 /*yield*/, newUser()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, login(all_users_saved)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    if (user_input === "3") {
                        process.exit();
                    }
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.menu = menu;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, menu()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
