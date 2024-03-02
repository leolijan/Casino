/**
 * Prints the casino splash screen/logo to the console.
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
 * Prints a list of options to the console. Each option is passed as an entry in an object,
 * where the key is the option number and the value is the description of the option.
 *
 * @param options An object containing key-value pairs of options.
 */
export function printOptions(options: { [key: string]: string }): void {
    for (const [key, value] of Object.entries(options)) {
      console.log(`${key}) ${value}`);
    }
  }