/**
 * Validates a password based on specific criteria: 
 * at least one uppercase letter, one special character, 
 * and a minimum length of 8 characters.
 *
 * @example
 * isValidPassword("Password123!"); // Returns true
 * isValidPassword("pass"); // Returns false
 *
 * @param password The password string to be validated.
 * @returns True if the password meets all criteria, false otherwise.
 */
export function isValidPassword(password: string): boolean {
    const hasUpperCase: boolean = /[A-Z]/.test(password);
    const hasSpecialChar: boolean = /[\W_]/.test(password);
    const isLongEnough: boolean = password.length >= 8;
  
    return hasUpperCase && hasSpecialChar && isLongEnough;
  }

