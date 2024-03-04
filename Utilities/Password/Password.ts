/**
 * Validates a password based on predefined criteria: must include at least one uppercase letter,
 * one special character, and be at least 8 characters long.
 *
 * @param password The password string to validate.
 * @returns Returns true if the password meets the criteria, false otherwise.
 */
export function isValidPassword(password: string): boolean {
    const hasUpperCase: boolean = /[A-Z]/.test(password);
    const hasSpecialChar: boolean = /[\W_]/.test(password);
    const isLongEnough: boolean = password.length >= 8;
  
    return hasUpperCase && hasSpecialChar && isLongEnough;
  }

