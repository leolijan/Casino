import * as readline from 'readline';

/**
 * Asynchronously reads user input from the console with a specified prompt
 * and maximum length.
 * @param {string} prompt - The message to display to the user.
 * @param {number} max - The maximum length of the input allowed.
 * @returns {Promise<string>} A promise resolving to the user's input string.
 * @throws {Error} If an error occurs during the input reading process.
 */
export async function readUserInput(prompt: string, max: number): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let koll = true;
  
    const retur = await new Promise<string>((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
            if(answer==="x"|| answer==="X") {
                process.exit();
            }
            if(!check(answer, max)){
                console.log("WRONG INPUT");
                koll = false;
            }
            
        });
    });
  
    return koll ? retur : readUserInput(prompt, max);
}


/**
 * Checks if the provided answer is within the valid range of input.
 * @param {string} answer - The user's input to be checked.
 * @param {number} max - The maximum allowed value for the input.
 * @returns {boolean} True if the answer is within the valid range, 
 *                    otherwise false.
 */
function check(answer: string, max: number): boolean{
    for(let i = 1; i<max+1; i++){
        if(answer===i.toString()){
            return true;
        }
    }
    return false;
}