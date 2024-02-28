import * as fs from 'fs';
import { Card } from '../Card Games/Deck/Deck';
import { Person } from '../Player/Player';
import { startGame as startBaccarat } from '../Card Games/Baccarat/Baccarat';
import { startGame as startBlackjack } from '../Card Games/Blackjack/Blackjack';
import { playerMove as startRoulette } from '../Card Games/Roulette/roulette';
import { readUserInput, readUserInputBasic } from '../userInput/readUserInput';

// Global variable
const textfile: string = "user_information.json";

function splashScreen(): void {
    const logo = `
            ███████████████████████████████████
          ██                                   ██
        ██                𝙄𝙏𝘾𝙖𝙨𝙞𝙣𝙤                ██
          ██                                   ██
            ███████████████████████████████████
            `;
    console.log(logo);
}

function printOptions(options: {[key: string]: string}): void {
    for (const [key, value] of Object.entries(options)) {
        console.log(`${key}) ${value}`);
    }
}

export async function loggedIn(user: string): Promise<void> {
    let all_users = readLoginCredentials(textfile);
    const options: {[key: string]: string} = {
        "1": "Blackjack",
        "2": "Baccarat",
        "3": "Roulette",
        "4": "Add Money",
        "5": "Log Out"
    };
    
    printOptions(options);

    const choice: string = await readUserInput("Option: ", 5);

    console.log(); // Add a newline for better formatting
    
    if (choice === "1") {
        await startBlackjack(all_users[user]);
    } else if (choice === "2") {
        await startBaccarat(all_users[user]);
    } else if (choice === "3") {
        await startRoulette(all_users[user]);
    } else if (choice === "4") {
        await insert_money(user, all_users); // Call insert_money here
    } else if (choice === "5") {
        console.log("Logging out...");
        return; // Exit the loggedIn function to log out
    }
    writeLoginCredentials(textfile, all_users); // Save after any operation
    await loggedIn(user); // Re-display the logged-in menu options
}

async function insert_money(username: string, all_users: {[key: string]: any}): Promise<void> {
    console.log("Select the amount of money to insert:");
    const moneyOptions: {[key: string]: string} = {
        "1": "100",
        "2": "200",
        "3": "500",
        "4": "1000",
        "5": "Enter a custom amount"
    };

    printOptions(moneyOptions);

    const choice = await readUserInput("Option (or 'X' to cancel): ", 5);

    if (choice.toLowerCase() === 'x') {
        console.log("Money insertion cancelled.");
        return;
    }

    let amount = 0;
    if (choice === "5") {
        const customAmountStr = await readUserInputBasic("Enter your custom amount: ");
        amount = parseFloat(customAmountStr);
        if (isNaN(amount) || amount <= 0) {
            console.log("Invalid amount.");
            return;
        }
    } else if (moneyOptions.hasOwnProperty(choice)) {
        amount = parseFloat(moneyOptions[choice]);
    } else {
        console.log("Invalid option selected.");
        return;
    }

    all_users[username].balance += amount;
    console.log(`$${amount} has been added to your account. Your new balance is $${all_users[username].balance}.`);
}


export async function login(users: {[key: string]: 
                                    {password: string}}): Promise<void> {
    while (true) {
        const username = await readUserInputBasic("Username: ");
        const password = await readUserInputBasic("Password: ");

        if (users[username] && password === users[username].password) {
            console.log(`Welcome ${username}`);
            await loggedIn(username);
        } else {
            console.log();
            console.log("Invalid username or password");
            console.log("Please try again or choose another option.");
            await menu();
        }
    }
}

export async function newUser(): Promise<void> {
    while (true) {
        const username = await readUserInputBasic("Choose your username: ");
        const password = await readUserInputBasic("Choose your password: ");
        const confirmedPassword = await readUserInputBasic("Confirm your password: ");

        if (password === confirmedPassword) {
            const all_users = readLoginCredentials(textfile);
            if (all_users[username]) {
                console.log("Username already exists. Choose a different username.");
                continue;
            }
            all_users[username] = {
                name: username,
                password: confirmedPassword,
                balance: 1000, // Default starting balance
                hand: [] // Empty hand at the start
            };
            writeLoginCredentials(textfile, all_users);
            console.log("Registration successful");

            break;
        } else {
            console.log("The two passwords are not identical");
            console.log("Try again!");
            console.log();
        }
    }
}

export function writeLoginCredentials(filename: string, 
                                        users: { [key: string]: 
                                                 { name: string; 
                                                   password: string; 
                                                   balance: number; 
                                                   hand: Array<Card>; } }): void {
    try {
        const data: string = JSON.stringify(users, null, 2);
        fs.writeFileSync(filename, data);
    } catch (err) {
        console.error(`An error occurred: ${err}`);
    }
}

export function readLoginCredentials(filename: string)
                                       : { [key: string]: 
                                           { name: string; 
                                             password: string; 
                                             balance: number; 
                                             hand: Array<Card>; } } {
    try {
        const data: string = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading the file: ${err}`);
        fs.writeFileSync(filename, '{}');
        return {};
    }
}


export async function menu(): Promise<void> {
    splashScreen();
    console.log();
    const all_users_saved: {[key: string]: Person} = readLoginCredentials(textfile);
    const menu_options: {[key: string]: string} = {"1": "Login", 
                                                   "2": "Register", 
                                                   "3": "Quit"};
    printOptions(menu_options);

    const user_input: string = await readUserInput("Option: ", 3);

    console.log(); // Add a newline for better formatting
    

    if (user_input === "1") {
        await login(all_users_saved);
    } else if (user_input === "2") {
        await newUser();
        await login(all_users_saved);
    } else if (user_input === "3") {
        process.exit();
    }
}


async function main(): Promise<void> {
    await menu();
}

main();