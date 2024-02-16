import * as readline from 'readline';
import * as fs from 'fs';

// Global variable
const textfile: string = "user_information.json";

function splash_screen(): void {
    const logo = `
            ███████████████████████████████████
          ██                                   ██
        ██                𝙄𝙏𝘾𝙖𝙨𝙞𝙣𝙤                ██
          ██                                   ██
            ███████████████████████████████████
            `;
    console.log(logo);
}

function print_options(options: {[key: string]: string}): void {
    for (const [key, value] of Object.entries(options)) {
        console.log(`${key}) ${value}`);
    }
}

// To be able to read user input effectively
function read_user_input(prompt: string): Promise<string> {
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

async function logged_in(user: string): Promise<void> {
    console.log();

    const options: {[key: string]: string} = {"b": "Black jack", "r": "Roulette", "q": "Return to menu"};
    print_options(options);

    const choice: string = await read_user_input("Option: ");

    console.log(); // Add a newline for better formatting

    if (choice === "a") {
        
    } else if (choice === "s") {
        
    } else if (choice === "g") {
        
    } else if (choice === "r") {
        splash_screen();
        await menu();
    }
}


async function login(users: {[key: string]: string}): Promise<void> {
    while (true) {
        const username = await read_user_input("Username: ");
        const password = await read_user_input("Password: ");

        if (users[username] && password === users[username]) {
            console.log(`Welcome ${username}`);
            await logged_in(username);
        } else {
            console.log();
            console.log("Invalid username or password");
            console.log("Please try again or choose another option.");
            await menu();
        }
    }
}

async function new_user(): Promise<void> {
    while (true) {
        const username = await read_user_input("Choose your username: ");
        const password = await read_user_input("Choose your password: ");
        const confirmedPassword = await read_user_input("Confirm your password: ");

        if (password === confirmedPassword) {
            const all_users: {[key: string]: string} = read_login_credentials(textfile);
            all_users[username] = confirmedPassword;
            write_login_credentials(textfile, all_users);
            console.log("Registration successful");

            // Reload user credentials after registration
            const updated_users: {[key: string]: string} = read_login_credentials(textfile);

            // Proceed to login with updated credentials
            await login(updated_users);

            break;
        } else {
            console.log("The two passwords are not identical");
            console.log("Try again!");
            console.log();
        }
    }
}

function write_login_credentials(filename: string, login_credentials: {[key: string]: string}): void {
    try {
        const data: string = JSON.stringify(login_credentials, null, 2);
        fs.writeFileSync(filename, data);
    } catch (err) {
        console.error(`An error occurred: ${err}`);
    }
}

function read_login_credentials(filename: string): {[key: string]: string} {
    try {
        const data: string = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        fs.writeFileSync(filename, '{}');
        return {};
    }
}

async function menu(): Promise<void> {
    splash_screen();
    console.log();
    const all_users_saved: {[key: string]: string} = read_login_credentials(textfile);
    const menu_options: {[key: string]: string} = {"l": "Login", "r": "Register", "q": "Quit"};
    print_options(menu_options);

    const user_input: string = await read_user_input("Option: ");

    console.log(); // Add a newline for better formatting

    if (user_input === "l") {
        await login(all_users_saved);
    } else if (user_input === "r") {
        await new_user();
        await login(all_users_saved);
    } else if (user_input === "q") {
        process.exit();
    }
}

async function main(): Promise<void> {githgit
    await menu();
}

main();
