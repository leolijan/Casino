import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { Person } from '../Utilities/Player/Player';
import { startGame as startBaccarat } from '../Games/Card Games/Baccarat/Baccarat';
import { startGame as startBlackjack } from '../Games/Card Games/Blackjack/Blackjack';
import { startGame as startRoulette } from '../Games/Roulette/roulette';
import { readUserInput, readUserInputBasic } from '../Utilities/userInput/readUserInput';
import { splashScreen, printOptions } from '../Utilities/visuals/visuals';
import { isValidPassword } from '../Utilities/Password/Password';

export type AllUsers = { [username: string]: Person };


const textfile: string = "../user_information.json";//the json file


/**
 * Loads user data from a JSON file into a provided object.
 * @param filePath The path to the JSON file containing user data.
 * @param allUsersObj The object into which user data will be loaded.
 */
export function loadUserData(filePath: string, allUsers : AllUsers): void {
  try {
    const data: string = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(data);
    Object.assign(allUsers, users); // Load data into the provided object
  } catch (err) {
    console.error(`Error reading the file: ${err}`);
    Object.assign(allUsers, {}); // Initialize as an empty object on error
  }
}

/**
 * Saves the current state of a provided allUsers object into a JSON file.
 * @param filePath The path to the JSON file where user data will be saved.
 * @param allUsersObj The object containing user data to save.
 */
export function saveUserData(filePath: string, allUsers : AllUsers): void {
  try {
    const data: string = JSON.stringify(allUsers, null, 2);
    fs.writeFileSync(filePath, data);
  } catch (err) {
    console.error(`An error occurred while saving user data: ${err}`);
  }
}

  
/**
 * Handles the main menu for a logged-in user, allowing them to select a game 
 * to play, add money, or log out.
 * Depending on the user's choice, it will call the corresponding game 
 * start function or the insert_money function.
 *
 * @param user The username of the currently logged-in user.
 */
export async function loggedIn(user: string, 
                               allUsers : AllUsers): Promise<void> {

  const currentUser = allUsers[user];

  if(currentUser.balance<=0){
    const options: {[key: string]: string} = {
        "1": "Add Money",
        "2": "Log Out"
    };
    
    printOptions(options);

    const choice: string = await readUserInput("Option: ", 2);

    console.log(); // Add a newline for better formatting

    if(choice==="1"){
      await insert_money(user,allUsers);
    }else{
      console.log("Logging out...");
      return await menu(allUsers) // Exit the loggedIn function to log out
    }
  }else{
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
        await startBlackjack(currentUser);
    } else if (choice === "2") {
        await startBaccarat(currentUser);
    } else if (choice === "3") {
        await startRoulette(currentUser);
    } else if (choice === "4") {
        await insert_money(user, allUsers); // Call insert_money here
    } else {
        console.log("Logging out...");
        return await menu(allUsers) // Exit the loggedIn function to log out
    }
  }
  await loggedIn(user,allUsers);
}

/**
 * Prompts the user to insert money into their account. The user can select a 
 * predefined amount or enter a custom amount.
 * If the entered amount is valid, it is added to the user's balance.
 *
 * @param username The username of the currently logged-in user.
 */
export async function insert_money(username: string, 
                                   allUsers : AllUsers): Promise<void> {
  console.log("Select the amount of money to insert:");
  const moneyOptions: { [key: string]: string } = {
    "1": "100",
    "2": "200",
    "3": "500",
    "4": "1000",
    "5": "Enter a custom amount",
    "6": "exit"
  };

  printOptions(moneyOptions);

  const choice: string = await readUserInput("Option : ", 6);

  if (choice === "6") {
    console.log("Exiting money insertion.");
    return; // Exits the function early
  }

  let amount: number = 0;
  if (choice === "5") {
    const message : string = "Enter your custom amount: "
    const customAmountStr: string = await readUserInputBasic(message);
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
 * Handles the login process, allowing a user to attempt to log in 
 * with a username and password.
 * Limits the number of attempts to prevent brute force attacks.
 */
export async function login(allUsers : AllUsers): Promise<void> {
  let attempts: number = 0;
  const maxAttempts: number = 3;
  
  while (attempts < maxAttempts) {
    attempts += 1;
    const username: string = await readUserInputBasic("Username: ");
    const submittedPassword: string = await readUserInputBasic("Password: ");
    
    if (allUsers[username]) {
      const match: boolean = await bcrypt.compare(submittedPassword, 
                                                  allUsers[username].password);
      
      if (match) {
        console.log(`Welcome ${username}`);
        await loggedIn(username, allUsers);
        break;
      } else {
        console.log("\nInvalid username or password");
      }
    } else {
      console.log("\nInvalid username or password");
    }
  }

  console.log("Maximum login attempts reached. Please try again later.");
  setTimeout(async () => await menu(allUsers), 3000);
}
  
/**
 * Allows a new user to register by choosing a username and a password. 
 * It checks if the password meets
 * the required security standards and if the username is not already taken.
 */
export async function newUser(allUsers : AllUsers): Promise<void> {
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
 * Displays the main menu of the application, allowing users to login, register, 
 * or quit the program.
 * It handles user input and redirects to the 
 * appropriate function based on the user's choice.
 */
export async function menu(allUsers : AllUsers): Promise<void> {
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
    await login(allUsers);
  } else if (user_input === "2") {
    await newUser(allUsers);
    await login(allUsers);
  } else if (user_input === "3") {
    console.log("Exiting program...");
    saveUserData(textfile, allUsers); // Save data only when exiting the program
    process.exit();
  }
}
  
/**
 * The main entry point of the application. 
 * It initializes the application by loading user data from a file
 * and then displays the main menu to the user.
 */
async function main(allUsers : AllUsers = {}): Promise<void> {
  loadUserData(textfile, allUsers);
  await menu(allUsers);
}


main();
