import * as readline from 'readline';
import * as fs from 'fs';
import { Card } from '../Card Games/Deck/Deck';
import { Person } from '../Player/Player';
import { startGame as startBaccarat } from '../Card Games/Baccarat/Baccarat';
import { startGame as startBlackjack } from '../Card Games/Blackjack/Blackjack';
import { playerMove as startRoulette } from '../Card Games/Roulette/roulette';

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

export function read_user_input(prompt: string): Promise<string> {
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

function printOptions(options: {[key: string]: string}): void {
    for (const [key, value] of Object.entries(options)) {
        console.log(`${key}) ${value}`);
    }
}

export async function loggedIn(user: string): Promise<void> {
    let all_users = readLoginCredentials(textfile);
    const options: {[key: string]: string} = {"1": "Black jack", 
                                              "2" : "Baccarat" , 
                                              "3": "Roulette", 
                                              "4": "Return to menu"};
    printOptions(options);

    const choice: string = await read_user_input("Option: ");

    console.log(); // Add a newline for better formatting
    

    if (choice === "1") {
        await startBlackjack(all_users[user]);
        writeLoginCredentials(textfile, all_users); 
    }else if (choice === "2") {
        await startBaccarat(all_users[user]);
        writeLoginCredentials(textfile, all_users); 
    } else if (choice === "3") {
        await startRoulette(all_users[user]);
        writeLoginCredentials(textfile, all_users); 
    } else if (choice === "4") {
        splashScreen();
        await menu();
    }

   // test person: {name: "VB", password: "VB21", balance: 2000, hand: []}
}

export async function login(users: {[key: string]: 
                                    {password: string}}): Promise<void> {
    while (true) {
        const username = await read_user_input("Username: ");
        const password = await read_user_input("Password: ");

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
        const username = await read_user_input("Choose your username: ");
        const password = await read_user_input("Choose your password: ");
        const confirmedPassword = await read_user_input("Confirm your password: ");

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
    const menu_options: {[key: string]: string} = {"l": "Login", 
                                                   "r": "Register", 
                                                   "q": "Quit"};
    printOptions(menu_options);

    const user_input: string = await read_user_input("Option: ");

    console.log(); // Add a newline for better formatting
    

    if (user_input === "l") {
        await login(all_users_saved);
    } else if (user_input === "r") {
        await newUser();
        await login(all_users_saved);
    } else if (user_input === "q") {
        process.exit();
    }
}

async function main(): Promise<void> {
    await menu();
}

main();