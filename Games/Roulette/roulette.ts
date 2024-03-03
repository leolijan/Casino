import * as readline from 'readline';
import { readUserInput } from '../../userInput/readUserInput';
import { Person, createPerson } from '../../Player/Player';
import { head, list, List, pair, tail, is_null, to_string as display_list, empty_list } from '../../lib/list';


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



/** ODDS
 * single: 35:1
 * split: 17:1
 * street: 11:1
 * corner: 8:1
 * double street: 5:1
 * columns/dozens: 2:1
 * red/black/odd/even/high/low(18 numbers): 1:1
 */
type stake = number;

// bettype, money betted, numbers betted on
export type bet = [BetType, stake, Array<number>];


// Global variable to keep track of all red numbers:
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 
                    19, 21, 23, 25, 27, 30, 32, 34, 36];
const streets = [[1,2,3], [4,5,6], [7,8,9], [10,11,12], 
                 [13,14,15], [16,17,18], [19,20,21], [22,23,24], 
                 [25,26,27], [28,29,30], [31,32,33], [34,35,36]];



export async function startGame(person: Person, allBets: List<bet> = empty_list()): Promise<void> {
    // could add print_options from login
    console.log("WELCOME TO ROULETTE YOU HAVE " + person.balance.toString() + " DOLLARS");
    while(true){
        const before = person.balance;
        await playerMove(person, allBets);

        computerMove(person, before, allBets);

        const prompt = "Want to play more?: Yes(1) or No(2)\n";
        const userInput = await readUserInput(prompt, 2);

        if(userInput === "1") {
            allBets = empty_list();
        }else{
            break;
        }
    }
}

export function computerMove(person: Person, before: number, allBets: List<bet>){
    // Spin the wheel and call the calculatewinnings functions 
        // and register the payout to the account
        const winningNumber = spin();
        console.log("WINNING NUMBER IS: " + winningNumber);
        console.log();
        const winnings = calculateWinnings(allBets, winningNumber);
        person.balance += winnings;
        const delta = person.balance - before;
        
        const str = delta > 0 ? "YOU WON " + delta + " DOLLARS" : delta < 0 ? "YOU LOST " + Math.abs(delta) + " DOLLARS" : "YOU BROKE EVEN";
        console.log(str);        
        console.log("Balance after: ", 
                    person.balance);
}


/**
 * Manages the player's move in the roulette game.
 * @param person The player represented as a Person object.
 */
export async function playerMove(person: Person, allBets: List<bet>): Promise<void> {
    console.log("YOU HAVE " + person.balance + " DOLLARS TO BET WITH");
    
    const stake = await addBetAmount(person);
    //person add bet

    // type of bet:
    // 1. numbers bet (single, split, street, corner, doublestreet)
    // 2. even bets (RedBlack, EvenOdd, LowHigh)
    // 3. Columns or dozens

    const bet: bet = await buildABet(stake);
    // place bets and register bets
    allBets = pair(bet, allBets);

    console.log("YOUR BET: ", bet)
    console.log("ALL BETS: ", display_list(allBets));
    
    const prompt = "Want to add a bet?: Yes(1) or No(2)\n";
    const userInput = await readUserInput(prompt, 2);

    if (userInput === "1") {
        await playerMove(person, allBets);
    } else {}
}

export function spin(): number{
    // 0-36
    return Math.floor(Math.random()*37);
}


/**
 * Prompts the player to input the amount of money they would like to bet
 * and then removes that amount from their wallet balance. 
 * @param person The player represented as a Person object.
 * @param bet The bet details according to the bet type.
 */
export async function addBetAmount(person: Person): Promise<stake> {
    const userInput = await readUserInput("How much would you like to bet? \n",
                                          person.balance);
    const stake = Number(userInput);
    person.balance -= stake;

    return stake;
}

/**
 * Prompts the player to build a bet of their choice by
 * selecting the type of bet.
 * @param bet The bet details according to the bet type.
 */
export async function buildABet(stake: stake): Promise<bet> {
    console.log("\n---------BUILD A BET----------\n");
    
    const prompt = "1. Numbers bet (single, split, street, corner, doublestreet)" +
                   "\n2. Even bets (RedBlack, EvenOdd, LowHigh)" +
                   "\n3. Columns or dozens\n";
    const userInput = await readUserInput(prompt, 3);
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
 * Prompts the player to build a numbers bet 
 * (single, split, street, corner, doublestreet).
 * @param bet The bet details according to the bet type.
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

        if (first % 3 === 0) {
            // High up
            amount = numbers.push(first - 1, first + 3, first - 3);
        } else if (first % 3 === 1) {
            // Lowest
            amount = numbers.push(first + 1, first + 3, first - 3);
        } else {
            // Middle
            amount = numbers.push(first - 1, first + 1, first + 3, first - 3);
        }

        let str = "Choose second number: ";
        let moved = 0;
        
        for (let i = 0; i < amount; i++) {
            if (numbers[i] < 1 || numbers[i] > 36) {
                moved++;
                numbers[i] = -1;
            } else {
                str += "nr: " + numbers[i].toString() + 
                       " (" + (i - moved + 1).toString() + "), ";
            }
        }        
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
            inp = await readUserInput("Go left to " + (first-3).toString() + " (1) or right to " + (first+3).toString() + " (2): \n", 2);  
            second = Number(inp) === 1 ? first - 3 : first + 3;
        }

        // Up (first, first - 1, second, second - 1)
        // Down (first, first + 1, second, second + 1)
        inp = await readUserInput("Go up (1): ("+ (first).toString() + "," + 
                                  (first - 1).toString() + "," + 
                                  (second - 1).toString() + "," + 
                                  (second).toString() + ")" + " or down (2): (" + 
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

        // CHECK IF STREET IS OUTSIDE OF SCOPE
        inp = await readUserInput("Choose second street: street " + 
                                  (first - 1).toString() + " (1) or street " + 
                                  (first + 1).toString()+ " (2):\n", 2);

        bet[2][1] = Number(inp) === 1 ? first - 1 : first + 1;
    } else {} 
}


/**
 * Prompts the player to build an bet that is of the 
 * category even bets (RedBlack, EvenOdd, LowHigh).
 * @param bet The bet details according to the bet type.
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
 * Prompts the player to build a columns or dozens bet.
 * @param bet The bet details according to the bet type.
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
        } else if (inp === "3") {//This line 
            bet[0] = 3;
        } else {}
    } else if (inp === "2") {
        // Dozens
        inp = await readUserInput("Choose dozen 1: (1-12)\n"+
                                  "Choose dozen 2: (13-24)\n"+
                                  "Choose dozen 3: (25-36)\n", 3);
        if (inp === "1") {
            bet[0] = 4;
        } else if (inp === "2") {
            bet[0] = 5;
        } else if (inp === "3") {//This line
            bet[0] = 6;
        } else {}
    } else {}   
}


/**
 * Calculates the total winnings for a player based on their bets placed
 * and the winning number each time. 
 * @param bets An array of bets placed, where each bet is 
 *             represented by [BetType, stake, Array<number>].
 * @param number The winning number in the roulette game.
 * @returns The total payout amount.
 */
export function calculateWinnings(bets: List<bet>, number: number): number {
    if (is_null(bets)) {
        return 0;
    } else {
        return calcPayout(head(bets), number) + calculateWinnings(tail(bets),
                                                                  number);
    }
}

/**
 * Calculates the payout based on the type of bet and winning number.
 * @param bet An array of bets placed, where each bet is 
 *            represented by [BetType, stake, Array<number>].
 * @param number The winning number in the roulette game.
 * @returns The calculated payout amount.
 */
export function calcPayout(bet: bet, number: number): number {
    const typeOfBet: BetType = bet[0];
    return typeOfBet === "Single" 
           ? calcSingle(bet[2], bet[1], number) 
           : typeOfBet === "Split" 
           ? calcSplit(bet[2], bet[1], number) 
           : typeOfBet === "Street"
           ? calcStreet(bet[2], bet[1], number) 
           : typeOfBet === "Corner" 
           ? calcCorner(bet[2], bet[1], number) 
           : typeOfBet === "DoubleStreet" 
           ? calcDoubleStreet(bet[2], bet[1], number) 
           : typeOfBet === ("Red" || "Black") //here
           ? calcRedOrBlack(typeOfBet, bet[1], number) 
           : typeOfBet === ("Even" || "Odd") 
           ? calcEvenOrOdd(typeOfBet, bet[1], number) 
           : typeOfBet === ("Low" || "High") 
           ? calcLowOrHigh(typeOfBet, bet[1], number) 
           : typeOfBet ===  (1 || 2 || 3) 
           ? calcColumns(typeOfBet, bet[1], number) 
           : typeOfBet ===  (4 || 5 || 6) //to here
           ? calcDozens(typeOfBet, bet[1], number) 
           : 0;
}


/**
 * Calculates the payout for a bet on a single number.
 * @param bet An array of bets placed, where each bet is 
 *            represented by [BetType, stake, Array<number>].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
export function calcSingle(bet: Array<number>, stake: stake, number: number): number {
    return bet[0] === number ? stake * 36 : 0;
}

/**
 * Calculates the payout for a split bet placed on two adjacent numbers.
 * This function validates that the bet is placed on numbers within the valid range (1-36)
 * and that the numbers are adjacent on the roulette table. It returns the payout amount
 * if one of the bet numbers matches the winning number and the bet is valid.
 * 
 * @param bet An array containing two numbers on which the split bet is placed.
 * @param stake The amount of money staked on the bet.
 * @param number The winning number of the roulette spin.
 * @returns The payout amount if the bet wins, otherwise 0.
 */
export function calcSplit(bet: Array<number>, 
                          stake: stake, number: number): number {
    // Validate numbers are within the roulette table range
    if (bet.some(num => num < 1 || num > 36)) {
        return 0; // No payout for numbers outside the valid range
    }

    // Check if the bet numbers are adjacent on the roulette table
    const isAdjacent = Math.abs(bet[0] - bet[1]) === 1 || 
                       Math.abs(bet[0] - bet[1]) === 3;
    if (!isAdjacent) {
        return 0; // No payout for non-adjacent numbers
    }

    // Calculate and return payout if bet wins
    return bet.includes(number) ? stake * 18 : 0;
}

/**
 * Calculates the payout for a bet on a street. This is three consecutive
 *  numbers in a horizontal line.
 * @param bet An array of bets placed, where each bet is 
 *            represented by [BetType, stake, Array<number>].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
export function calcStreet(bet: Array<number>, stake: stake, number: number): number {
    return (streets[bet[0]].includes(number)) ? stake * 12 : 0;
}

/**
 * Calculates the payout for a bet on a corner. This is when four numbers meet
 * at one corner.
 * @param bet An array of bets placed, where each bet is 
 *            represented by [BetType, stake, Array<number>].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
export function calcCorner(bet: Array<number>, stake: stake, number: number): number {
    return (number >= bet[0] && number <= bet[0] + 4) ? stake * 8 : 0;
}


/**
 * Calculates the payout for a bet placed on a double street. This is six 
 * consecutive numbers that form two horizontal lines.
 * @param bet An array of bets placed, where each bet is 
 *            represented by [BetType, stake, Array<number>].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
export function calcDoubleStreet(bet: Array<number>, 
                          stake: stake, number: number): number {
    return (streets[bet[0]].includes(number) || streets[bet[1]].includes(number)) 
           ? stake * 6 
           : 0;
}

/**
 * Calculates the payout for a bet placed on either red or black numbers.
 * This function includes a check for special cases (0 and 00), which are traditionally
 * not considered either red or black, and returns a payout based on whether the winning
 * number matches the bet's color selection.
 * @param redOrBlack - The color selected for the bet (Red or Black).
 * @param stake - The amount of stake placed on the bet.
 * @param number - The winning number in the roulette game.
 * @returns The payout for the placed bet if it wins, otherwise 0.
 */
export function calcRedOrBlack(redOrBlack: Color, stake: number, number: number): number {
    if (number === 0 || number === 37) {
        return 0; 
    }

    if (redOrBlack === Color.Red) {
        return redNumbers.includes(number) ? stake * 2 : 0;
    } else {
        return !redNumbers.includes(number) ? stake * 2 : 0;
    }
}

/**
 * Calculates the payout for a bet placed on either even or odd numbers.
 * Special consideration is given to the number 0, which is neither even nor odd,
 * resulting in no payout for bets on even or odd if the winning number is 0.
 * @param evenOrOdd - The type of selection for the bet (Even or Odd).
 * @param stake - The amount of stake placed on the bet.
 * @param number - The winning number in the roulette game.
 * @returns The payout for the placed bet if it wins, otherwise 0.
 */
export function calcEvenOrOdd(evenOrOdd: EvenOdd, stake: number, number: number): number {
    if (number === 0) {
        return 0;
    }

    if (evenOrOdd === EvenOdd.Even) {
        return number % 2 === 0 ? stake * 2 : 0;
    } else {
        return number % 2 !== 0 ? stake * 2 : 0;
    }
}


/**
 * Calculates the payout for a bet placed on either low or high. 
 * @param lowOrHigh The range of selection for the bet, either low or high.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
export function calcLowOrHigh(lowOrHigh: LowHigh, stake: stake, number: number): number {
    if (lowOrHigh === LowHigh.Low) {
        if (number <= 18) {
            return stake * 2;
        } else {
            return 0;
        }
    } else {
        if (number >= 19) {
            return stake * 2;
        } else {
            return 0;
        }
    }
}


/**
 * Calculates the payout for a bet placed on a column.
 * @param column The column selected for the bet.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
export function calcColumns(column: Columns, stake: stake, number: number): number {
    if ((number - column) % 3 === 0) {
        return stake * 3;
    } else {
        return 0;
    }
}


/**
 * Calculates the payout for a bet placed on a dozen.
 * @param column The dozen selected for the bet.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
export function calcDozens(dozens: Dozens, stake: stake, number: number): number {
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

