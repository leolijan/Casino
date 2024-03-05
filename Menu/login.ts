import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { Person } from '../Utilities/Player/Player';
import { startGame as startBaccarat } from '../Games/Card Games/Baccarat/Baccarat';
import { startGame as startBlackjack } from '../Games/Card Games/Blackjack/Blackjack';
import { startGame as startRoulette } from '../Games/Roulette/roulette';
import { readUserInput, readUserInputBasic } from '../Utilities/userInput/readUserInput';
import { splashScreen, printOptions } from '../Utilities/visuals/visuals';
import { isValidPassword } from '../Utilities/Password/Password';
import { insertMoney } from '../Utilities/InsertMoney/InsertMoney';

export type AllUsers = { [username: string]: Person };

//The JSON file all user infromation is stored in.
const textfile: string = "../user_information.json"; 

/**
 * Loads user data from a JSON file into an AllUsers object.
 *
 * @example
 * loadUserData("path/to/userData.json", allUsers);
 * // allUsers is populated with data from userData.json
 *
 * @param filePath Path to the JSON file containing user data.
 * @param allUsers The object to load the user data into.
 *
 * @precondition The filePath must point to a valid, accessible JSON file.
 */
export function loadUserData(filePath: string, allUsers: AllUsers): void {
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
 * Saves the provided allUsers object's current state to a JSON file.
 * 
 * @example
 * saveUserData("path/to/userData.json", allUsers);
 * // Saves allUsers to userData.json
 *
 * @param filePath Path where user data will be saved.
 * @param allUsersObj Object containing user data.
 * 
 * @precondition The filePath must point to a valid, accessible JSON file.
 */
export function saveUserData(filePath: string, allUsers: AllUsers): void {
  try {
    const data: string = JSON.stringify(allUsers, null, 2);
    fs.writeFileSync(filePath, data);
  } catch (err) {
    console.error(`An error occurred while saving user data: ${err}`);
  }
}


/**
 * Presents the main menu for a logged-in user, allowing game selection, 
 * inserting money, or logout.
 *
 * @example
 * // Assuming user "TestUser" is logged in with a positive balance if balance 
 * // is not positive only two options come up, 1 : Add money, 2 : Log Out.
 * await loggedIn("TestUser", allUsers);
 * // Presents game options or allows adding money/logging out
 *
 * @param user Username of the logged-in user.
 * @param allUsers Object containing all user data.
 */
export async function loggedIn(user: string, 
                               allUsers : AllUsers): Promise<void> {

  const currentUser = allUsers[user];

  if (currentUser.balance <= 0) {
    const options: {[key: string]: string} = {
        "1": "Add Money",
        "2": "Log Out"
    };
    
    printOptions(options);

    const choice: string = await readUserInput("Option: ", 2);
    console.log(); 

    if (choice === "1") {
      await insertMoney(user, allUsers);
    } else {
      console.log("Logging out...");
      return await menu(allUsers) // Exit the loggedIn function to log out
    }
    
  } else { 
    const options: {[key: string]: string} = {
        "1": "Blackjack",
        "2": "Baccarat",
        "3": "Roulette",
        "4": "Add Money",
        "5": "Log Out"
    };
    
    printOptions(options);

    const choice: string = await readUserInput("Option: ", 5);
    console.log();
    
    if (choice === "1") {
        await startBlackjack(currentUser);

    } else if (choice === "2") {
        await startBaccarat(currentUser);

    } else if (choice === "3") {
        await startRoulette(currentUser);

    } else if (choice === "4") {
        await insertMoney(user, allUsers); // Call insertMoney here

    } else {
        console.log("Logging out...");
        return await menu(allUsers) // Exit the loggedIn function to log out
    }
  }
  await loggedIn(user,allUsers);
}


/**
 * Manages the login process, allowing users to enter their credentials.
 * Limits login attempts to 3. Redirects to the main menu after 
 * maximum attempts. Directs to loggedIn if user succsesfully logs in.
 *
 * @example
 * // User initiates login process
 * await login(allUsers);
 * // User is prompted for username and password up to 3 times
 *
 * @param allUsers Object containing user credentials.
 */
export async function login(allUsers: AllUsers): Promise<void> {
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
 * Registers a new user with a username and password, ensuring password strength 
 * and username uniqueness.
 *
 * @example
 * // User is prompted to register a new account
 * await newUser(allUsers);
 * // User enters a username and password, receives feedback, 
 * and may be registered
 *
 * @param allUsers Object containing existing user information.
 */
export async function newUser(allUsers: AllUsers): Promise<void> {
  while (true) {
    const username: string = await readUserInputBasic("Choose your username: ");
    const password: string = await readUserInputBasic("Choose your password: ");
    const confirmPrompt = "Confirm your password: ";
    const confirmedPassword: string = await readUserInputBasic(confirmPrompt);

    if (!isValidPassword(password)) {
      console.log("Password does not meet the required standards: at least " + 
                  "one uppercase letter, one special character, and at least " + 
                  "8 characters long.");
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
 * or quit the program. It handles user input and redirects to the 
 * appropriate function based on the user's choice.
 * @param allUsers Object containing existing user information.
 */
export async function menu(allUsers: AllUsers): Promise<void> {
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
 * Displays the main menu, offering options to log in, register, or quit.
 *
 * @example
 * // User accesses the main application menu
 * await menu(allUsers);
 * // User is presented with options and can navigate accordingly
 *
 * @param allUsers Object holding user data for login and registration.
 */
async function main(allUsers: AllUsers = {}): Promise<void> {
  loadUserData(textfile, allUsers);
  await menu(allUsers);
}


// Starting the game when running the file.
main();
