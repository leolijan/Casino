"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPassword = void 0;
/**
 * Validates a password based on predefined criteria: must include at least one uppercase letter,
 * one special character, and be at least 8 characters long.
 *
 * @param password The password string to validate.
 * @returns Returns true if the password meets the criteria, false otherwise.
 */
function isValidPassword(password) {
    var hasUpperCase = /[A-Z]/.test(password);
    var hasSpecialChar = /[\W_]/.test(password);
    var isLongEnough = password.length >= 8;
    return hasUpperCase && hasSpecialChar && isLongEnough;
}
exports.isValidPassword = isValidPassword;
