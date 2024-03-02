import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { Person } from '../Player/Player';
import { startGame as startBaccarat } from '../Games/Card Games/Baccarat/Baccarat';
import { startGame as startBlackjack } from '../Games/Card Games/Blackjack/Blackjack';
import { startGame as startRoulette } from '../Games/Roulette/roulette';
import { readUserInput, readUserInputBasic } from '../userInput/readUserInput';
import { splashScreen, printOptions } from '../lib/visuals/visuals';
import { isValidPassword } from '../lib/Password/Password';
type AllUsers = { [username: string]: Person };

const textfile: string = "../user_information.json";
let allUsers : AllUsers = {}; //Memoization :)

/**
 * Loads user data from a JSON file into the allUsers object. If the file does not exist or an error occurs,
 * the function logs an error message and initializes allUsers as an empty object.
 */
function loadUserData(): void {
  try {
    const data: string = fs.readFileSync(textfile, 'utf8');
    allUsers = JSON.parse(data);
  } catch (err) {
    console.error(`Error reading the file: ${err}`);
    allUsers = {};
  }
}

/**
 * Saves the current state of allUsers object into a JSON file. If an error occurs during the save process,
 * the function logs an error message.
 */
function saveUserData(): void {
  try {
    const data: string = JSON.stringify(allUsers, null, 2);
    fs.writeFileSync(textfile, data);
  } catch (err) {
    console.error(`An error occurred while saving user data: ${err}`);
  }
}
  
/**
 * Handles the main menu for a logged-in user, allowing them to select a game to play, add money, or log out.
 * Depending on the user's choice, it will call the corresponding game start function or the insert_money function.
 *
 * @param user The username of the currently logged-in user.
 */
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
      return await menu() // Exit the loggedIn function to log out
  }
  await loggedIn(user); // Re-display the logged-in menu options
}

/**
 * Prompts the user to insert money into their account. The user can select a predefined amount or enter a custom amount.
 * If the entered amount is valid, it is added to the user's balance.
 *
 * @param username The username of the currently logged-in user.
 */
async function insert_money(username: string): Promise<void> {
  console.log("Select the amount of money to insert:");
  const moneyOptions: { [key: string]: string } = {
    "1": "100",
    "2": "200",
    "3": "500",
    "4": "1000",
    "5": "Enter a custom amount"
  };

  printOptions(moneyOptions);

  const choice: string = await readUserInput("Option (or 'X' to cancel): ", 5);

  if (choice.toLowerCase() === 'x') {
    console.log("Money insertion cancelled.");
    return;
  }

  let amount: number = 0;
  if (choice === "5") {
    const customAmountStr: string = await readUserInputBasic("Enter your custom amount: ");
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
  

/**
 * Handles the login process, allowing a user to attempt to log in with a username and password.
 * Limits the number of attempts to prevent brute force attacks.
 */
export async function login(): Promise<void> {
  let attempts: number = 0;
  const maxAttempts: number = 3;
  
  while (attempts < maxAttempts) {
    attempts += 1;
    const username: string = await readUserInputBasic("Username: ");
    const submittedPassword: string = await readUserInputBasic("Password: ");
    
    if (allUsers[username]) {
      const match: boolean = await bcrypt.compare(submittedPassword, allUsers[username].password);
      
      if (match) {
        console.log(`Welcome ${username}`);
        await loggedIn(username);
        break;
      } else {
        console.log("\nInvalid username or password");
      }
    } else {
      console.log("\nInvalid username or password");
    }
  }

  console.log("Maximum login attempts reached. Please try again later.");
  setTimeout(async () => await menu(), 3000);
}
  
/**
 * Allows a new user to register by choosing a username and a password. It checks if the password meets
 * the required security standards and if the username is not already taken.
 */
export async function newUser(): Promise<void> {

  while (true) {
    const username: string = await readUserInputBasic("Choose your username: ");
    const password: string = await readUserInputBasic("Choose your password: ");
    const confirmedPassword: string = await readUserInputBasic("Confirm your password: ");

    if (!isValidPassword(password)) {
      console.log("Password does not meet the required standards: at least one uppercase letter, one special character, and at least 8 characters long.");
      continue;
    }

    if (password === confirmedPassword) {
      if (allUsers[username]) {
        console.log("Username already exists. Choose a different username.");
        continue;
      }

      const saltRounds: number = 10;
      const hash: string = await bcrypt.hash(confirmedPassword, saltRounds);

      allUsers[username] = {
        name: username,
        password: hash,
        balance: 1000,
        hand: []
      };

      console.log("Registration successful");
      break;
    } else {
      console.log("The two passwords are not identical. Try again!\n");
    }
  }
}
  

  
/**
 * Displays the main menu of the application, allowing users to login, register, or quit the program.
 * It handles user input and redirects to the appropriate function based on the user's choice.
 */
export async function menu(): Promise<void> {
  splashScreen();
  console.log();
  const menu_options: { [key: string]: string } = {
    "1": "Login",
    "2": "Register",
    "3": "Quit"
  };

  printOptions(menu_options);

  const user_input: string = await readUserInput("Option: ", 3);
  console.log(); // Add a newline for better formatting

  if (user_input === "1") {
    await login();
  } else if (user_input === "2") {
    await newUser();
    await login(); // Assume newUser logs the user in automatically after registration
  } else if (user_input === "3") {
    console.log("Exiting program...");
    saveUserData(); // Save data only when exiting the program
    process.exit();
  }
}
  
/**
 * The main entry point of the application. It initializes the application by loading user data from a file
 * and then displays the main menu to the user.
 */
async function main(): Promise<void> {
  loadUserData();
  await menu();
}
  
main();
