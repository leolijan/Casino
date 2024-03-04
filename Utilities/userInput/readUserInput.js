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
exports.check = exports.readUserInputBasic = exports.readUserInput = void 0;
var readline = require("readline");
/**
 * Asynchronously reads user input from the console with a specified prompt
 * and maximum length.
 * @param prompt - The message to display to the user.
 * @param max - The maximum length of the input allowed.
 * @returns The user's input string.
 */
function readUserInput(prompt, max) {
    return __awaiter(this, void 0, void 0, function () {
        var rl, isValidInput, userInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    isValidInput = true;
                    return [4 /*yield*/, new Promise(function (resolve) {
                            rl.question(prompt, function (answer) {
                                rl.close();
                                resolve(answer);
                                if (!check(answer, max)) {
                                    console.log("WRONG INPUT");
                                    isValidInput = false;
                                }
                            });
                        })];
                case 1:
                    userInput = _a.sent();
                    return [2 /*return*/, isValidInput ? userInput : readUserInput(prompt, max)];
            }
        });
    });
}
exports.readUserInput = readUserInput;
/**
 * Asynchronously reads user input from the console with a specified prompt.
 * This version is simplified and does not include checks for maximum input
 * length or specific exit commands.
 * It's designed to provide a basic interface for user input
 * in console applications.
 *
 * @example
 * readUserInputBasic("Please enter your name: ").then(name =>
 * console.log(`Hello, ${name}!`));
 *
 * @param prompt The message displayed to the user before waiting for input.
 * @returns The user input as a string.
 */
function readUserInputBasic(prompt) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(function (resolve) {
        rl.question(prompt, function (answer) {
            rl.close();
            resolve(answer);
        });
    });
}
exports.readUserInputBasic = readUserInputBasic;
/**
 * Checks if the provided answer is within the valid range of input.
 * @param answer The user's input to be checked.
 * @param max The maximum allowed value for the input.
 * @returns True if the answer is within the valid range,
 *                    otherwise false.
 */
function check(answer, max) {
    for (var i = 1; i < max + 1; i++) {
        if (answer === i.toString()) {
            return true;
        }
    }
    return false;
}
exports.check = check;
