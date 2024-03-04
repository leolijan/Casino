/**
 * Prints the casino splash screen/logo to the console.
 * @returns void
 */
export function splashScreen(): void {
  const logo: string = `
    ███████████████████████████████████
  ██                                   ██
██                𝙄𝙏𝘾𝙖𝙨𝙞𝙣𝙤                ██
  ██                                   ██
    ███████████████████████████████████
    `;
  console.log(logo);
}


/**
 * Prints a list of options to the console, provided as key-value pairs where 
 * the key represents the option number and the value describes the option.
 *
 * @example
 * printOptions({ "1": "Blackjack", "2": "Insert Money", "3": "Logout" });
 * // Prints:
 * // 1) Blackjack
 * // 2) Insert Money
 * // 3) Logout
 *
 * @param options An object containing options where each key is an option number 
 * and each value is the description of the option.
 * @returns void. Lists all provided options to the console.
 */
export function printOptions(options: { [key: string]: string }): void {
  for (const [key, value] of Object.entries(options)) {
    console.log(`${key}) ${value}`);
  }
}

/**
 * Outputs a specified number of empty lines to the console.
 *
 * @example
 * printEmptyLines(3);
 * // Prints 3 empty lines to the console
 *
 * @param count The number of empty lines to print.
 * @returns void. Outputs empty lines to the console.
 */
export function printEmptyLines(count: number): void {
  for (let i = 0; i < count; i++) {
    console.log();
  }
}
