import * as readline from 'readline';

/**
 * Asynchronously reads user input from the console with a specified prompt
 * and maximum length.
 * @param prompt - The message to display to the user.
 * @param max - The maximum length of the input allowed.
 * @returns The user's input string.
 */
export async function readUserInput(prompt: string, 
                                    max: number): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let isValidInput : Boolean = true;
  
    const userInput = await new Promise<string>((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
            
            if(!check(answer, max)){
                console.log("WRONG INPUT");
                isValidInput = false;
            } else {}
        });
    });
  
    return isValidInput ? userInput : readUserInput(prompt, max);
}


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
export function readUserInputBasic(prompt: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise<string>((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

/**
 * Checks if the provided answer is within the valid range of input.
 * @param answer The user's input to be checked.
 * @param max The maximum allowed value for the input.
 * @returns True if the answer is within the valid range, 
 *          otherwise false.
 */
export function check(answer: string, max: number): boolean {
    for (let i = 1; i < max + 1; i++) {
        if (answer === i.toString()) {
            return true;
        } else {}
    }
    return false;
}

