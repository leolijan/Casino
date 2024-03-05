import { readUserInput } from '../../Utilities/userInput/readUserInput';
import { Person } from '../../Utilities/Player/Player';
import { head, List, pair, tail, is_null, 
         to_string as display_list, empty_list } from '../../Utilities/list';

// All possible bets
export type BetType = EvenMoney | TwoToOne | RestOfBets | "";

// All of the bets where you win the same amount you bet.
type EvenMoney = Color | LowHigh | EvenOdd;

export enum Color {
    Red = 'Red',
    Black = 'Black'
}
export enum LowHigh {
    Low = 'Low',
    High = 'High'
}
export enum EvenOdd {
    Even = 'Even',
    Odd = 'Odd'
}

// The bets where you win twice the amount you bet.
type TwoToOne = Columns | Dozens;
type Columns = 1 | 2 | 3;
type Dozens = 4 | 5 | 6;

// The rest of the bets with different odds depending on the specific bet. 
type RestOfBets = "Single" | "Split" | "Street" | "Corner" | "DoubleStreet";

type stake = number;

// bettype, money betted, numbers betted on
export type bet = [BetType, stake, Array<number>];

// Global variable to keep track of all red numbers:
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 
                    19, 21, 23, 25, 27, 30, 32, 34, 36];

const streets = [[1,2,3], [4,5,6], [7,8,9], [10,11,12], 
                 [13,14,15], [16,17,18], [19,20,21], [22,23,24], 
                 [25,26,27], [28,29,30], [31,32,33], [34,35,36]];

                
/**
 * Manages the game loop for a roulette game, handling player bets, spins, 
 * and outcomes.
 *
 * @example
 * await startGame(player, allBets);
 * // The game loop runs, allowing the player to place bets and 
 * play rounds of roulette.
 *
 * @param person The player represented as a Person object.
 * @param allBets An initially empty list of bets that the player chooses 
 *                before each spin.
 */
                 
export async function startGame(person: Person, 
                                allBets: List<bet> = empty_list())
                                : Promise<void> {
    
    while (true) {
        if (person.balance === 0) {
            console.log("UNFORTUNATELY YOU'RE OUT OF FUNDS COME BACK LATER");
            break;            
        } else {
            console.log("WELCOME TO ROULETTE YOU HAVE " + 
                        person.balance.toString() + " DOLLARS");
            const before = person.balance;
            await playerMove(person, allBets);

            computerMove(person, before, allBets);
        
            const prompt = "Want to play more?: Yes(1) or No(2)\n";
            const userInput = await readUserInput(prompt, 2);

            if (userInput === "1") {
                allBets = empty_list();
            } else {
                break;
            }
        }
    }
}

/**
 * Handles the intermediary actions in a game, 
 * such as spinning the wheel in roulette,
 * calculating winnings based on player bets, 
 * and updating the player's balance.
 *
 * @example
 * computerMove(person, person.balance, allBets);
 * // Spins the wheel, calculates winnings, 
 * and updates person's balance accordingly.
 *
 * @param person The player represented as a Person object.
 * @param before The amount of money the player had before the 
 *               current game round.
 * @param allBets A list of bets placed by the player for the current round.
 */
export function computerMove(person: Person, 
                             before: number, 
                             allBets: List<bet>): void {
    // Spin the wheel and call the calculatewinnings functions 
    // and register the payout to the account
    const winningNumber = spin();
    console.log("WINNING NUMBER IS: " + winningNumber);
    console.log();
    const winnings = calculateWinnings(allBets, winningNumber);
    person.balance += winnings;
    const delta = person.balance - before;
    
    const str = delta > 0 
                ? "YOU WON " + delta + " DOLLARS" 
                : delta < 0 
                ? "YOU LOST " + Math.abs(delta) + " DOLLARS" 
                : "YOU BROKE EVEN";

    console.log(str);        
    console.log("Balance after: ", 
                person.balance);
}


/**
 * Manages the player's moves in a roulette game, 
 * allowing them to place bets and make decisions.
 *
 * @example
 * await playerMove(player, allBets);
 * // Prompts the player to place bets and captures their decisions
 *
 * @param person The player participating in the game, 
 *               represented as a Person object.
 * @param allBets A list of bets the player has chosen before the spin. 
 *                It is set to empty at the start of the game.
 */
export async function playerMove(person: Person, 
                                 allBets: List<bet>): Promise<void> {

    console.log("YOU HAVE " + person.balance + " DOLLARS TO BET WITH");
    const stake = await addBetAmount(person);

    const bet: bet = await buildABet(stake);

    allBets = pair(bet, allBets);  // Place bets and register bets

    console.log("YOUR BET: ", bet)
    console.log("ALL BETS: ", display_list(allBets));
    
    const prompt = "Want to add a bet?: Yes(1) or No(2)\n";
    const userInput = await readUserInput(prompt, 2);

    if (userInput === "1") {
        await playerMove(person, allBets);
    } else {}
}


/**
 * Randomizes and returns a number between 0 and 36, inclusive, 
 * simulating a roulette wheel spin.
 *
 * @example
 * const result = spin();
 * // result is a random number between 0 and 36.
 *
 * @returns A number between 0 and 36 representing the outcome of a 
 *          roulette wheel spin.
 */
export function spin(): number {
    return Math.floor(Math.random() * 37);
}


/**
 * Prompts the player for the amount they wish to bet and takes it away 
 * from their balance.
 *
 * @example
 * const stake = await addBetAmount(player);
 * // The player is prompted to input their bet amount, 
 * which is then subtracted from their balance.
 *
 * @param person The player represented as a Person object.
 * @returns The bet amount made by the player as a number. 
 */
export async function addBetAmount(person: Person): Promise<stake> {
    const userInput = await readUserInput("How much would you like to bet? \n",
                                          person.balance);
    const stake = Number(userInput);
    person.balance -= stake;

    return stake;
}

/**
 * Guides the player through building a bet for the roulette game, 
 * including selecting the type of bet.
 *
 * @example
 * const bet = await buildABet(stake);
 * // The player is prompted to choose the type of bet, 
 * which is then returned as a bet object.
 *
 * @param stake The amount of money betted by the player.
 * @returns A bet object representing the player's chosen bet and stake amount.
 */
export async function buildABet(stake: stake): Promise<bet> {
    console.log("\n---------BUILD A BET----------\n");
    
    const str = "1. Numbers bet (single, split, street, corner, doublestreet)" +
                "\n2. Even bets (RedBlack, EvenOdd, LowHigh)" +
                "\n3. Columns or dozens\n";

    const userInput = await readUserInput(str, 3);
    const bet: bet = ["", stake, []];

    if (userInput === "1"){
        await numberBet(bet);
    } else if (userInput === "2"){
        await evenBets(bet);
    } else {
        await columnsAndDozensBet(bet);
    }

    return bet;
}


/**
 * Prompts the player to choose a numbers bet for roulette. This includes 
 * options for single, split, street, corner, or double street bets.
 *
 * @example
 * await numberBet(bet);
 * // The bet object is modified to reflect the player's chosen numbers bet.
 *
 * @param bet The bet which will be modified by the player.
 */
export async function numberBet(bet: bet): Promise<void> {
    const prompt = "Choose: zero (1), single (2), split (3), street (4), " +
                   "corner (5) or doublestreet (6)\n";
    let inp = await readUserInput(prompt, 6);

    if (inp === "1"){
        bet[0] = "Single";
        bet[2][0] = 0;
        
    } else if (inp === "2") {
        // Single
        inp = await readUserInput("Choose number: ", 36);
        bet[0] = "Single";
        bet[2][0] = Number(inp);

    } else if (inp === "3") {
        // Split 
        let amount = 0;
        inp = await readUserInput("Choose first number: ", 36);   
        bet[0] = "Split";  
        const first = Number(inp);
        
        bet[2][0] = first;
        const numbers: Array<number> = [];

        // check line to ensure right amount of adjacent numbers
        if (first % 3 === 0) {
            // Highest line
            amount = numbers.push(first - 1, first + 3, first - 3);
        } else if (first % 3 === 1) {
            // Lowest line
            amount = numbers.push(first + 1, first + 3, first - 3);
        } else {
            // Middle line
            amount = numbers.push(first - 1, first + 1, first + 3, first - 3);
        }

        let str = "Choose second number: ";
        let moved = 0;
        
        for (let i = 0; i < amount; i++) {
            if (numbers[i] < 1 || numbers[i] > 36) {
                moved++;
            } else {
                str += "nr: " + numbers[i].toString() + 
                       " (" + (i - moved + 1).toString() + "), ";
            }
        }        

        // New line added for readability
        str += "\n"
        
        inp = await readUserInput(str, amount);  
        const second = Number(inp); 
        bet[2][1] = numbers[second - 1] === -1 
                    ? numbers[second] 
                    : numbers[second - 1];

        console.log(bet[2]);

    } else if (inp === "4") {
        // Street 
        inp = await readUserInput("Choose street: (1-12): \n", 12); 
        bet[0] = "Street"; 
        bet[2][0] = Number(inp);

    } else if (inp === "5") {
        // Corner
        inp = await readUserInput("Choose first number: \n", 36);
        bet[0]= "Corner";
        const first = Number(inp);
        
        let second;
        if (first - 3 < 1) {
            // Go right
            second = first + 3;
        } else if (first + 3 > 36) {
            // Go left
            second = first - 3;
        } else {
            inp = await readUserInput("Go left to " + (first-3).toString() +
                                      " (1) or right to " + 
                                      (first+3).toString() + " (2): \n", 2);  
            second = Number(inp) === 1 ? first - 3 : first + 3;
        }

        // Up (first, first - 1, second, second - 1)
        // Down (first, first + 1, second, second + 1)
        inp = await readUserInput("Go up (1): ("+ (first).toString() + "," + 
                                  (first - 1).toString() + "," + 
                                  (second - 1).toString() + "," + 
                                  (second).toString() + ")" + " or down (2): ("+ 
                                  (first).toString() + "," + 
                                  (first + 1).toString() + "," + 
                                  (second + 1).toString() + "," + 
                                  (second).toString() + "): \n", 2);
                                                       
        bet[2] = Number(inp) === 1 
                 ? [first, first - 1, second, second - 1] 
                 : [first, first + 1, second, second + 1];

    } else if (inp === "6") {
        // Doublestreet
        bet[0] = "DoubleStreet";
        inp = await readUserInput("Choose first street (1-12):\n", 12);  
        const first = Number(inp);
        bet[2][0] = first;

        // Check if street is outside of scope
        if (first - 1 === 0) {
            console.log("SECOND STREETNR IS 2");            
            inp = (2).toString();
        } else if (first + 1 === 13) {
            console.log("SECOND STREETNR IS 11"); 
            inp = (1).toString();
        } else {
            inp = await readUserInput("Choose second street: street " + 
                                      (first - 1).toString() + 
                                      " (1) or street " + 
                                      (first + 1).toString() + " (2):\n", 2);
        }

        bet[2][1] = Number(inp) === 1 ? first - 1 : first + 1;
    } else {} 
}


/**
 * Prompts the player to select an even bet type, such as Red/Black, 
 * Even/Odd, or Low/High.
 *
 * @example
 * await evenBets(bet);
 * // The player is prompted to select an even bet type, 
 * modifying the bet object accordingly.
 *
 * @param bet The bet which will be modified by the player. 
 */
export async function evenBets(bet: bet): Promise<void> {
    const prompt =  "Choose red/black (1), even/odd (2) or low/high (3)\n";
    let inp = await readUserInput(prompt, 3);

    if (inp === "1") {
        // Red/Black
        const red = "(1, 3, 5, 7, 9, 12, 14, 16, 18, 19," + 
                    " 21, 23, 25, 27, 30, 32, 34, 36)";
        const black = "(2, 4, 6, 8, 10, 11, 13, 15, 17, 20," + 
                      " 22, 24, 26, 28, 29, 31, 33, 35)";
        inp = await readUserInput("Choose red numbers (1): \n" + red + "\n" +
                                  "Choose black number (2): \n"+ black + "\n",
                                  2);
        if (inp === "1") {
            bet[0] = Color.Red;
        } else if (inp === "2") {
            bet[0] = Color.Black;
        } else {}

    } else if (inp === "2") {
        // Even/Odd
        inp = await readUserInput("Choose even numbers (1): \n"+
                                  "Choose odd numbers (2): \n", 2);
        if (inp === "1") {
            bet[0] = EvenOdd.Even;
        } else if (inp === "2") {
            bet[0] = EvenOdd.Odd;
        } else {}

    } else if (inp === "3") {
        // Low/High
        inp = await readUserInput("Choose low numbers (1): (1-18)\n"+
                                  "Choose odd numbers (2): (19-36)\n", 2);
        if (inp === "1") {
            bet[0] = LowHigh.Low;
        } else if (inp === "2") {
            bet[0] = LowHigh.High;
        } else {}
    } else {} 
}


/**
 * Prompts player to select either a columns bet or a dozens bet in roulette.
 *
 * @example
 * await columnsAndDozensBet(bet);
 * // The player is prompted to select either columns or dozens bet, 
 * modifying the bet object accordingly.
 *
 * @param bet The bet which will be modified by the player.
 */
export async function columnsAndDozensBet(bet: bet): Promise<void>{
    let inp = await readUserInput("Choose columns (1) or dozens (2): \n", 2);
    if (inp === "1") {
        // Columns
        inp = await readUserInput("Choose column 1: (1,4,7,10,...,34)\n" +
                                  "Choose column 2: (2,5,8,11,...,35)\n" +
                                  "Choose column 3: (3,6,9,12,...,36)\n", 3);
        if (inp === "1") {
            bet[0] = 1;
        } else if (inp === "2") {
            bet[0] = 2;
        } else if (inp === "3") {
            bet[0] = 3;
        } else {}
    } else if (inp === "2") {
        // Dozens
        inp = await readUserInput("Choose dozen 1: (1-12)\n" +
                                  "Choose dozen 2: (13-24)\n" +
                                  "Choose dozen 3: (25-36)\n", 3);
        if (inp === "1") {
            bet[0] = 4;
        } else if (inp === "2") {
            bet[0] = 5;
        } else if (inp === "3") {
            bet[0] = 6;
        } else {}
    } else {}   
}


/**
 * Calculates the total winnings for a player based on their placed bets and 
 * the winning roulette number.
 *
 * @example
 * const totalWinnings = calculateWinnings(bets, winningNumber);
 * // Calculates and returns the player's total payout based 
 * on the winning number
 *
 * @param bets A list of bets placed by the player. Each bet is represented as 
 *             an array with the type bet.
 * @param number The winning number in the roulette game.
 * @returns The total payout amount based on the bets and the winning number.
 */
export function calculateWinnings(bets: List<bet>, number: number): number {
    if (is_null(bets)) {
        return 0;
    } else {
        return calcPayout(head(bets), number) + 
               calculateWinnings(tail(bets), number);
    }
}


/**
 * Calculates the payout for a specific bet based on the winning number 
 * in a roulette game.
 *
 * @example
 * // If a bet is placed on a single number with a stake of $100
 * const payout = calcPayout(["Single", 100, [17]], 17);
 * // Returns the payout amount based on the roulette payout rules
 *
 * @param bet The bet of the player.
 * @param number The winning number for the roulette spin.
 * @returns The payout amount based on the bet type and whether the 
 *          bet won or lost.
 */
export function calcPayout(bet: bet, number: number): number {
    const typeOfBet: BetType = bet[0];
    return typeOfBet === "Single" 
           ? calcSingle(bet[2], bet[1], number) 
           : typeOfBet === "Split" 
           ? calcSplit(bet[2], bet[1], number) 
           : typeOfBet === "Street"
           ? calcStreet(bet[2][0], bet[1], number) 
           : typeOfBet === "Corner" 
           ? calcCorner(bet[2], bet[1], number) 
           : typeOfBet === "DoubleStreet" 
           ? calcDoubleStreet(bet[2], bet[1], number) 
           : typeOfBet === ("Red" || "Black") 
           ? calcRedOrBlack(typeOfBet, bet[1], number) 
           : typeOfBet === ("Even" || "Odd") 
           ? calcEvenOrOdd(typeOfBet, bet[1], number) 
           : typeOfBet === ("Low" || "High") 
           ? calcLowOrHigh(typeOfBet, bet[1], number) 
           : typeOfBet ===  (1 || 2 || 3) 
           ? calcColumns(typeOfBet, bet[1], number) 
           : typeOfBet ===  (4 || 5 || 6) 
           ? calcDozens(typeOfBet, bet[1], number) 
           : 0;
}


/**
 * Calculates the payout for a bet on a single number in a roulette game.
 *
 * @example
 * // If a bet on number 17 with a $100 stake
 * const payout = calcSingle([17], 100, 17);
 * // Returns $3600 if the winning number is 17, otherwise $0
 *
 * @param bet The bet of the player.
 * @param stake The amount of money staked on the bet.
 * @param number The winning number of the roulette spin.
 * @returns The payout for the bet. If the bet wins, 
 *          returns stake multiplied by 36. Otherwise, returns 0.
 */
export function calcSingle(bet: Array<number>, 
                           stake: stake, 
                           number: number): number {

    return bet[0] === number ? stake * 36 : 0;
}

/**
 * Calculates the payout for a split bet placed on two adjacent numbers.
 * This function validates that the bet is placed on numbers within the 
 * valid range (1-36) and that the numbers are adjacent on the roulette table. 
 * It returns the payout amount if one of the bet numbers matches the winning 
 * number and the bet is valid.
 * 
 * @example
 * // Assuming a bet on numbers 17 and 18 with a $100 stake
 * const payout = calcSplit([17, 18], 100, 18);
 * // Returns $1800 if 18 is the winning number, otherwise $0
 *
 * @param bet The bet of the player.
 * @param stake The amount of money staked on the bet.
 * @param number The winning number of the roulette spin.
 * @returns The payout amount if the bet wins, otherwise 0.
 */
export function calcSplit(bet: Array<number>, 
                          stake: stake, 
                          number: number): number {
    // Validate numbers are within the roulette table range
    if (bet.some(num => num < 1 || num > 36)) {
        return 0; // No payout for numbers outside the valid range
    } else {}

    // Check if the bet numbers are adjacent on the roulette table
    const isAdjacent = Math.abs(bet[0] - bet[1]) === 1 || 
                       Math.abs(bet[0] - bet[1]) === 3;

    if (!isAdjacent) {
        return 0; // No payout for non-adjacent numbers
    } else {}

    // Calculate and return payout if bet wins
    return bet.includes(number) ? stake * 18 : 0;
}

/**
 * Calculates the payout for a bet on a street, which consists of three 
 * consecutive numbers in a horizontal line.
 *
 * @example
 * // Assuming a valid street index and a winning number are defined
 * const payout = calcStreet(1, 100, 3); // If the street starting at 1 
 * includes the number 3
 * // Returns $1200 if number 3 is part of the bet street, otherwise $0
 *
 * @param index The index identifying the specific street bet, 
 *              used to reference a predefined array of streets.
 * @param stake The amount of money staked on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the bet if the winning number is 
 *          within the bet street, otherwise 0.
 */
export function calcStreet(index: number, 
                           stake: stake, 
                           number: number): number {

    return (streets[index].includes(number)) ? stake * 12 : 0;
}

/**
 * Calculates the payout for a corner bet in roulette, 
 * where a bet is placed on four numbers that meet at one corner.
 *
 * @example
 * // If a bet is placed on the numbers [1, 2, 4, 5] with a $100 stake
 * const payout = calcCorner([1, 2, 4, 5], 100, 4);
 * // Returns $800 if number 4 is the winning number, otherwise $0
 *
 * @param bet The bet of the player.
 * @param stake The amount of money staked on the bet.
 * @param number The winning number of the roulette spin.
 * @returns The payout for the placed bet if one of the corner numbers is 
 * the winning number, otherwise 0.
 */
export function calcCorner(bet: Array<number>, 
                           stake: stake,
                           number: number): number {

    return (bet.includes(number)) ? stake * 8 : 0;
}


/**
 * Calculates the payout for a double street bet in roulette, covering six 
 * consecutive numbers across two horizontal lines.
 *
 * @example
 * // If a bet is placed on two adjacent streets with indexes 1 and 2, 
 * with a winning number that falls within these streets
 * const payout = calcDoubleStreet([1, 2], 100, 4);
 * // Returns half the stake multiplied by 12 if the winning number is 
 * within the double street, otherwise 0
 *
 * @param indexes An array of two indexes, each pointing to a set of three 
 * consecutive numbers (a "street") in the roulette table layout.
 * @param stake The amount of money staked on the bet.
 * @param number The winning number of the roulette spin.
 * @returns The payout for the bet if one of the double street's numbers is the 
 * winning number, otherwise 0.
 */
export function calcDoubleStreet(indexes: Array<number>, 
                                 stake: stake, 
                                 number: number): number {
    let ret = 0;

    indexes.forEach(index => {   
        ret += calcStreet(index,stake,number);
    });
    
    return ret / 2;
}


/**
 * Calculates the payout for a bet on either red or black numbers in roulette. 
 * The payout is determined based on whether the winning number 
 * matches the bet's color selection.
 *
 * @example
 * // Assuming a bet is placed on red with a $100 stake, 
 * and the winning number is in the red numbers array
 * const payout = calcRedOrBlack(Color.Red, 100, 3); // 3 is a red number
 * // Returns $200 if 3 is red, otherwise $0
 *
 * @param redOrBlack The color selected for the bet, either Red or Black.
 * @param stake The amount of money staked on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the bet if the winning number 
 * matches the selected color, otherwise returns 0.
 */
export function calcRedOrBlack(redOrBlack: Color, 
                               stake: number, 
                               number: number): number {

    if (redOrBlack === Color.Red) {
        return redNumbers.includes(number) ? stake * 2 : 0;
    } else {
        return !redNumbers.includes(number) ? stake * 2 : 0;
    }
}


/**
 * Calculates the payout for a bet placed on either even or odd numbers 
 * in roulette, with special consideration for the number 0, 
 * which is neither even nor odd.
 *
 * @example
 * // Assuming a bet on even numbers with a $100 stake, 
 * and the winning number is 4
 * const payout = calcEvenOrOdd(EvenOdd.Even, 100, 4);
 * // Returns $200 if the winning number is even, otherwise $0
 *
 * @param evenOrOdd The type of selection for the bet, 
 * indicating whether the bet is on Even or Odd numbers.
 * @param stake The amount of money staked on the bet.
 * @param number The winning number of the roulette spin. 
 * The number 0 is considered neither even nor odd, resulting in a $0 payout.
 * @returns The payout for the placed bet if it wins, 
 * otherwise 0. Winning criteria are based on the number's 
 * parity matching the bet type.
 */
export function calcEvenOrOdd(evenOrOdd: EvenOdd, 
                              stake: number, 
                              number: number): number {
    if (number === 0) {
        return 0;
    } else {}

    if (evenOrOdd === EvenOdd.Even) {
        return number % 2 === 0 ? stake * 2 : 0;
    } else {
        return number % 2 !== 0 ? stake * 2 : 0;
    }
}


/**
 * Calculates the payout for a bet placed on either the low (1-18) or 
 * high (19-36) range of numbers in roulette.
 *
 * @example
 * // Assuming a bet is placed on the low range with a $100 stake, 
 * and the winning number is 5
 * const payout = calcLowOrHigh(LowHigh.Low, 100, 5);
 * // Returns $200 if the winning number is within the bet range, otherwise $0
 *
 * @param lowOrHigh The range of selection for the bet, 
 * indicating whether the bet is on the low (1-18) or high (19-36) range.
 * @param stake The amount of money staked on the bet.
 * @param number The winning number of the roulette spin. 
 * The number 0 is considered neither low nor high, resulting in a $0 payout.
 * @returns The payout for the bet if the winning number falls 
 * within the selected range, otherwise 0.
 */
export function calcLowOrHigh(lowOrHigh: LowHigh, 
                              stake: stake, 
                              number: number): number {

    if (lowOrHigh === LowHigh.Low) {
        if (number <= 18 && number > 0) {
            return stake * 2;
        } else {
            return 0;
        }
    } else {
        if (number >= 19 && number > 0) {
            return stake * 2;
        } else {
            return 0;
        }
    }
}


/**
 * Calculates the payout for a bet placed on one of the three 
 * columns in roulette. Each column consists of 12 numbers.
 *
 * @example
 * // Assuming a bet is placed on the first column with a $100 stake, 
 * and the winning number is in the first column
 * const payout = calcColumns(1, 100, 3); 
 * // Returns $300 if the winning number is in the selected column, otherwise $0
 *
 * @param column The column selected for the bet, identified by its 
 * index (1, 2, or 3 corresponding to the three columns).
 * @param stake The amount of money staked on the bet.
 * @param number The winning number of the roulette spin. 
 * The function checks if this number is part of the selected column.
 * @returns The payout for the placed bet if the winning number 
 * falls within the selected column, otherwise 0.
 */
export function calcColumns(column: Columns, 
                            stake: stake, 
                            number: number): number {

    if ((number - column) % 3 === 0 && number > 0) {
        return stake * 3;
    } else {
        return 0;
    }
}


/**
 * Calculates the payout for a bet placed on one of the 
 * three dozens in roulette.
 *
 * @example
 * // Assuming a bet is placed on the first dozen with a $100 stake, 
 * and the winning number falls within the first dozen
 * const payout = calcDozens(1, 100, 4);
 * // Returns $300 if the winning number is within the first dozen, otherwise $0
 *
 * @param dozens The dozen selected for the bet, with values 1, 2, or 
 * 3 representing the first, second, or third dozen, respectively.
 * @param stake The amount of money staked on the bet.
 * @param number The winning number of the roulette spin.
 * @returns The payout for the bet if the winning number falls within 
 * the selected dozen, otherwise 0.
 */
export function calcDozens(dozens: Dozens, 
                           stake: stake, 
                           number: number): number {
    // To match the indexes of the dozens.
    dozens -= 3;
    
    if (dozens === 1) {
        if (number <= 12) {
            return stake * 3;
        } else {
            return 0;
        }
    } else if (dozens === 2) {
        if (13 <= number && number <= 24) {
            return stake * 3;
        } else {
            return 0;
        }
    } else {
        if (number >= 25) {
            return stake * 3;
        } else {
            return 0;
        }
    } 
}