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
exports.menu = exports.newUser = exports.login = exports.loggedIn = void 0;
var bcrypt = require("bcrypt");
var fs = require("fs");
var Baccarat_1 = require("../Games/Card Games/Baccarat/Baccarat");
var Blackjack_1 = require("../Games/Card Games/Blackjack/Blackjack");
var roulette_1 = require("../Games/Roulette/roulette");
var readUserInput_1 = require("../userInput/readUserInput");
var visuals_1 = require("../lib/visuals/visuals");
var Password_1 = require("../lib/Password/Password");
var textfile = "../user_information.json";
var allUsers = {}; //Memoization :)
/**
 * Loads user data from a JSON file into the allUsers object. If the file does not exist or an error occurs,
 * the function logs an error message and initializes allUsers as an empty object.
 */
function loadUserData() {
    try {
        var data = fs.readFileSync(textfile, 'utf8');
        allUsers = JSON.parse(data);
    }
    catch (err) {
        console.error("Error reading the file: ".concat(err));
        allUsers = {};
    }
}
/**
 * Saves the current state of allUsers object into a JSON file. If an error occurs during the save process,
 * the function logs an error message.
 */
function saveUserData() {
    try {
        var data = JSON.stringify(allUsers, null, 2);
        fs.writeFileSync(textfile, data);
    }
    catch (err) {
        console.error("An error occurred while saving user data: ".concat(err));
    }
}
/**
 * Handles the main menu for a logged-in user, allowing them to select a game to play, add money, or log out.
 * Depending on the user's choice, it will call the corresponding game start function or the insert_money function.
 *
 * @param user The username of the currently logged-in user.
 */
function loggedIn(user) {
    return __awaiter(this, void 0, void 0, function () {
        var options, choice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        "1": "Blackjack",
                        "2": "Baccarat",
                        "3": "Roulette",
                        "4": "Add Money",
                        "5": "Log Out"
                    };
                    (0, visuals_1.printOptions)(options);
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Option: ", 5)];
                case 1:
                    choice = _a.sent();
                    console.log(); // Add a newline for better formatting
                    if (!(choice === "1")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, Blackjack_1.startGame)(allUsers[user])];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 3:
                    if (!(choice === "2")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, Baccarat_1.startGame)(allUsers[user])];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 5:
                    if (!(choice === "3")) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, roulette_1.startGame)(allUsers[user])];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 7:
                    if (!(choice === "4")) return [3 /*break*/, 9];
                    return [4 /*yield*/, insert_money(user)];
                case 8:
                    _a.sent(); // Call insert_money here
                    return [3 /*break*/, 11];
                case 9:
                    if (!(choice === "5")) return [3 /*break*/, 11];
                    console.log("Logging out...");
                    return [4 /*yield*/, menu()]; // Exit the loggedIn function to log out
                case 10: return [2 /*return*/, _a.sent()]; // Exit the loggedIn function to log out
                case 11: return [4 /*yield*/, loggedIn(user)];
                case 12:
                    _a.sent(); // Re-display the logged-in menu options
                    return [2 /*return*/];
            }
        });
    });
}
exports.loggedIn = loggedIn;
/**
 * Prompts the user to insert money into their account. The user can select a predefined amount or enter a custom amount.
 * If the entered amount is valid, it is added to the user's balance.
 *
 * @param username The username of the currently logged-in user.
 */
function insert_money(username) {
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
                        "5": "Enter a custom amount",
                        "6": "exit"
                    };
                    (0, visuals_1.printOptions)(moneyOptions);
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Option : ", 6)];
                case 1:
                    choice = _a.sent();
                    if (choice === "6") {
                        console.log("Exiting money insertion.");
                        return [2 /*return*/]; // Exits the function early
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
                    allUsers[username].balance += amount;
                    console.log("$".concat(amount, " has been added to your account. Your new balance is $").concat(allUsers[username].balance, "."));
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Handles the login process, allowing a user to attempt to log in with a username and password.
 * Limits the number of attempts to prevent brute force attacks.
 */
function login() {
    return __awaiter(this, void 0, void 0, function () {
        var attempts, maxAttempts, username, submittedPassword, match;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempts = 0;
                    maxAttempts = 3;
                    _a.label = 1;
                case 1:
                    if (!(attempts < maxAttempts)) return [3 /*break*/, 10];
                    attempts += 1;
                    return [4 /*yield*/, (0, readUserInput_1.readUserInputBasic)("Username: ")];
                case 2:
                    username = _a.sent();
                    return [4 /*yield*/, (0, readUserInput_1.readUserInputBasic)("Password: ")];
                case 3:
                    submittedPassword = _a.sent();
                    if (!allUsers[username]) return [3 /*break*/, 8];
                    return [4 /*yield*/, bcrypt.compare(submittedPassword, allUsers[username].password)];
                case 4:
                    match = _a.sent();
                    if (!match) return [3 /*break*/, 6];
                    console.log("Welcome ".concat(username));
                    return [4 /*yield*/, loggedIn(username)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 6:
                    console.log("\nInvalid username or password");
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    console.log("\nInvalid username or password");
                    _a.label = 9;
                case 9: return [3 /*break*/, 1];
                case 10:
                    console.log("Maximum login attempts reached. Please try again later.");
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, menu()];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); }, 3000);
                    return [2 /*return*/];
            }
        });
    });
}
exports.login = login;
/**
 * Allows a new user to register by choosing a username and a password. It checks if the password meets
 * the required security standards and if the username is not already taken.
 */
function newUser() {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, confirmedPassword, saltRounds, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, readUserInput_1.readUserInputBasic)("Choose your username: ")];
                case 1:
                    username = _a.sent();
                    return [4 /*yield*/, (0, readUserInput_1.readUserInputBasic)("Choose your password: ")];
                case 2:
                    password = _a.sent();
                    return [4 /*yield*/, (0, readUserInput_1.readUserInputBasic)("Confirm your password: ")];
                case 3:
                    confirmedPassword = _a.sent();
                    if (!(0, Password_1.isValidPassword)(password)) {
                        console.log("Password does not meet the required standards: at least one uppercase letter, one special character, and at least 8 characters long.");
                        return [3 /*break*/, 0];
                    }
                    if (!(password === confirmedPassword)) return [3 /*break*/, 5];
                    if (allUsers[username]) {
                        console.log("Username already exists. Choose a different username.");
                        return [3 /*break*/, 0];
                    }
                    saltRounds = 10;
                    return [4 /*yield*/, bcrypt.hash(confirmedPassword, saltRounds)];
                case 4:
                    hash = _a.sent();
                    allUsers[username] = {
                        name: username,
                        password: hash,
                        balance: 1000,
                        hand: []
                    };
                    console.log("Registration successful");
                    return [3 /*break*/, 7];
                case 5:
                    console.log("The two passwords are not identical. Try again!\n");
                    _a.label = 6;
                case 6: return [3 /*break*/, 0];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.newUser = newUser;
/**
 * Displays the main menu of the application, allowing users to login, register, or quit the program.
 * It handles user input and redirects to the appropriate function based on the user's choice.
 */
function menu() {
    return __awaiter(this, void 0, void 0, function () {
        var menu_options, user_input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, visuals_1.splashScreen)();
                    console.log();
                    menu_options = {
                        "1": "Login",
                        "2": "Register",
                        "3": "Quit"
                    };
                    (0, visuals_1.printOptions)(menu_options);
                    return [4 /*yield*/, (0, readUserInput_1.readUserInput)("Option: ", 3)];
                case 1:
                    user_input = _a.sent();
                    console.log(); // Add a newline for better formatting
                    if (!(user_input === "1")) return [3 /*break*/, 3];
                    return [4 /*yield*/, login()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 3:
                    if (!(user_input === "2")) return [3 /*break*/, 6];
                    return [4 /*yield*/, newUser()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, login()];
                case 5:
                    _a.sent(); // Assume newUser logs the user in automatically after registration
                    return [3 /*break*/, 7];
                case 6:
                    if (user_input === "3") {
                        console.log("Exiting program...");
                        saveUserData(); // Save data only when exiting the program
                        process.exit();
                    }
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.menu = menu;
/**
 * The main entry point of the application. It initializes the application by loading user data from a file
 * and then displays the main menu to the user.
 */
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadUserData();
                    return [4 /*yield*/, menu()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
