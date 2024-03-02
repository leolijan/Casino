"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printOptions = exports.splashScreen = void 0;
/**
 * Prints the casino splash screen/logo to the console.
 */
function splashScreen() {
    var logo = "\n      \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n    \u2588\u2588                                   \u2588\u2588\n  \u2588\u2588                \uD835\uDE44\uD835\uDE4F\uD835\uDE3E\uD835\uDE56\uD835\uDE68\uD835\uDE5E\uD835\uDE63\uD835\uDE64                \u2588\u2588\n    \u2588\u2588                                   \u2588\u2588\n      \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n      ";
    console.log(logo);
}
exports.splashScreen = splashScreen;
/**
 * Prints a list of options to the console. Each option is passed as an entry in an object,
 * where the key is the option number and the value is the description of the option.
 *
 * @param options An object containing key-value pairs of options.
 */
function printOptions(options) {
    for (var _i = 0, _a = Object.entries(options); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        console.log("".concat(key, ") ").concat(value));
    }
}
exports.printOptions = printOptions;
