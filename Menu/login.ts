import * as fs from 'fs';
import { Card } from '../Card Games/Deck/Deck';
import { Person } from '../Player/Player';
import { startGame as startBaccarat } from '../Card Games/Baccarat/Baccarat';
import { startGame as startBlackjack } from '../Card Games/Blackjack/Blackjack';
import { playerMove as startRoulette } from '../Card Games/Roulette/roulette';
import { readUserInput, readUserInputBasic } from '../userInput/readUserInput';

type AllUsers = { [username: string]: Person };

const textfile: string = "user_information.json";
let allUsers : AllUsers = {}; 

function loadUserData() {
    try {
        const data = fs.readFileSync(textfile, 'utf8');
        allUsers = JSON.parse(data);
    } catch (err) {
        console.error(`Error reading the file: ${err}`);
        allUsers = {};
    }
}

function saveUserData() {
    try {
        const data = JSON.stringify(allUsers, null, 2);
        fs.writeFileSync(textfile, data);
    } catch (err) {
        console.error(`An error occurred while saving user data: ${err}`);
    }
}

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
        await startBlackjack(allUsers[user]);
    } else if (choice === "2") {
        await startBaccarat(allUsers[user]);
    } else if (choice === "3") {
        await startRoulette(allUsers[user]);
    } else if (choice === "4") {
        await insert_money(user); // Call insert_money here
    } else if (choice === "5") {
        console.log("Logging out...");
        return; // Exit the loggedIn function to log out
    }
    await loggedIn(user); // Re-display the logged-in menu options
}

async function insert_money(username: string): Promise<void> {
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

    allUsers[username].balance += amount;
    console.log(`$${amount} has been added to your account. Your new balance is $${allUsers[username].balance}.`);
}

export async function login(): Promise<void> {
    while (true) {
        const username = await readUserInputBasic("Username: ");
        const password = await readUserInputBasic("Password: ");

        if (allUsers[username] && password === allUsers[username].password) {
            console.log(`Welcome ${username}`);
            await loggedIn(username); // Ensure loggedIn uses allUsers
        } else {
            console.log("\nInvalid username or password");
            console.log("Please try again or choose another option.");
            await menu();
            break; // Break here to avoid infinite loop if choosing to exit
        }
    }
}

export async function newUser(): Promise<void> {
    while (true) {
        const username = await readUserInputBasic("Choose your username: ");
        const password = await readUserInputBasic("Choose your password: ");
        const confirmedPassword = await readUserInputBasic("Confirm your password: ");

        if (password === confirmedPassword) {
            if (allUsers[username]) {
                console.log("Username already exists. Choose a different username.");
                continue;
            }
            allUsers[username] = {
                name: username,
                password: confirmedPassword,
                balance: 1000,
                hand: []
            };
            console.log("Registration successful");
            // Do not save here, saving is handled in menu when exiting
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
    // No need to readLoginCredentials here, using allUsers directly
    const menu_options: {[key: string]: string} = {
        "1": "Login",
        "2": "Register",
        "3": "Quit"
    };
    printOptions(menu_options);

    const user_input: string = await readUserInput("Option: ", 3);

    console.log(); // Add a newline for better formatting

    if (user_input === "1") {
        await login(); // Adjusted to use allUsers
    } else if (user_input === "2") {
        await newUser();
        await login() // newUser function will be adjusted to use allUsers
    } else if (user_input === "3") {
        console.log("Exiting program...");
        saveUserData(); // Save data only when exiting the program
        process.exit();
    }
}

async function main(): Promise<void> {
    await menu();
}

loadUserData();
main();