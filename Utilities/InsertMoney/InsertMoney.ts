import { readUserInput, readUserInputBasic } from "../userInput/readUserInput";
import { printOptions } from "../visuals/visuals";
import { AllUsers } from "../../Menu/login";


/**
 * Allows the user to add funds to their account by selecting a predefined 
 * amount or entering a custom amount.
 * Validates the entered amount before updating the user's balance.
 *
 * @example
 * // Assuming the user selects to add a predefined amount of $200
 * await insertMoney("johnDoe", allUsers);
 * // User's balance is updated by $200
 *
 * @param username The username of the currently logged-in user.
 * @param allUsers The collection of all user data, 
 * used to update the user's balance.
 *
 * @returns void. Updates the user's balance if a 
 * valid amount is entered or selected.
 */
export async function insertMoney(username: string, 
    allUsers: AllUsers): Promise<void> {
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
} else {}

let amount: number = 0;
if (choice === "5") {
const message : string = "Enter your custom amount: "
const customAmountStr: string = await readUserInputBasic(message);
amount = parseFloat(customAmountStr);

if (isNaN(amount) || amount <= 0) {
console.log("Invalid amount.");
return;
} else {}

} else if (moneyOptions.hasOwnProperty(choice)) {
amount = parseFloat(moneyOptions[choice]);
} else {
console.log("Invalid option selected.");
return;
}

allUsers[username].balance += amount;
console.log(`$${amount} has been added to your account. ` + 
`Your new balance is $${allUsers[username].balance}.`);
}