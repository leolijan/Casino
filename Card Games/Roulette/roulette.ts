import * as readline from 'readline';
import { Person, createPerson } from '../../Player/Player';

// All possible bets
type BetType = EvenMoney | TwoToOne | RestOfBets | "";


// All of the bets where you win the same amount you bet.
type EvenMoney = Color | LowHigh| EvenOdd;
enum Color {
    Red = 'Red',
    Black = 'Black'
}
enum LowHigh {
    Low = 'Low',
    High = 'High'
}
enum EvenOdd {
    Even = 'Even',
    Odd = 'Odd'
}

// The bets where you win twice the amount you bet.
type TwoToOne = Columns | Dozens;
type Columns = 1 | 2 | 3;
type Dozens = 4 | 5 | 6;

// The rest of the bets with different odds depending on the specific bet. 
type RestOfBets = "Single" | "Split" | "Street" | "Corner" | "DoubleStreet";

type numbersBet = [];

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

// rest(type of bet), money betted, numbers betted on
export type bet = [BetType, stake, []];


// Global variable to keep track of all red numbers:
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 
                    19, 21, 23, 25, 27, 30, 32, 34, 36];


function areAdjacentNumbers(firstNumber: number, secondNumber: number): boolean {
    let booleans = false;
    const difference = firstNumber - secondNumber;
    if (Math.abs(difference) < 3) {
        booleans = true;
    }


    if ((firstNumber % 3) === (secondNumber % 3)) {
        booleans = true;
    }


    return booleans;
}


function read_user_input(prompt: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise<string>((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
            if(answer==="x"|| answer==="X") process. exit();
        });
    });
}


function print_options(options: {[key: string]: string}): void {
    for (const [key, value] of Object.entries(options)) {
        console.log(`${key}) ${value}`);
    }
}
async function playerMove(person: Person) {
    // could add print_options from login
    console.log(person.name);
    while(true){
        // type of bet:
        // 1. numbers bet (single, split, street, corner, doublestreet)
        // 2. even bets (RedBlack, EvenOdd, LowHigh)
        // 3. Columns or dozens
        const options = "1. numbers bet (single, split, street, corner, doublestreet)\n2. even bets (RedBlack, EvenOdd, LowHigh)\n3. Columns or dozens\n";
        let userInput = await read_user_input(options);
        if(userInput==="1"){
            numberBet();
        }else if(userInput==="2"){
            evenBets();
        }else if(userInput==="3"){
            await columnsAndDozensBet(["",0,[]]);
        }else{
            continue;
        }
        // place bets and register bets

        await addBetAmount();

        userInput = await read_user_input("want to bet more?: (Y)es or (N)o\n");
        if(userInput==="Y" || userInput==="y"){
            // spin the wheel and call the calculatewinnings functions and register the payout to the account
            continue;
        }else if(userInput==="N" || userInput==="n"){
            break;
        }
    }
}




function numberBet(){




}




function evenBets(){




}




async function columnsAndDozensBet(bet: bet): Promise<void>{
    while(true){
        let inp = await read_user_input("Choose columns (1) or dozens (2)\n");
        if(inp==="1") {
            //columns
            while(true){
                inp = await read_user_input("Choose column 1: (1,4,7,10,...,34)\n"+
                                            "Choose column 2: (2,5,8,11,...,35)\n"+
                                            "Choose column 3: (3,6,9,12,...,36)\n");
                if(inp === "1"){
                    bet[0] = 1;
                }else if(inp === "2"){
                    bet[0] = 2;
                }else if(inp === "3"){
                    bet[0] = 3;
                }else{
                    continue;
                }
                break;
            }
        }else if(inp === "2") {
            //dozens
            while(true){
                inp = await read_user_input("Choose dozen 1: (1-12)\n"+
                                            "Choose dozen 2: (13-24)\n"+
                                            "Choose dozen 3: (25-36)\n");
                if(inp === "1"){
                    bet[0] = 4;
                }else if(inp === "2"){
                    bet[0] = 5;
                }else if(inp === "3"){
                    bet[0] = 6;
                }else{
                    continue;
                }
                break;
            }
        }else{
            continue;
        } 
        break;      
    }
}

async function addBetAmount(): Promise<void> {

}


/**
 * Calculates the total winnings for a player based on their bets placed
 * and the winning number each time. 
 * @param bets An array of bets placed, where each bet is 
 *             represented by [BetType, stake, number[]].
 * @param number The winning number in the roulette game.
 * @returns The total payout amount.
 */
function calculateWinnings(bets: bet[], number: number): number{
    let payout = 0;
    for(let i = 0; i < bets.length; i++){
        payout += calcPayout(bets[i], number);
    }
    
    return payout;
}


/**
 * Calculates the payout based on the type of bet and winning number.
 * @param bet An array of bets placed, where each bet is 
 *            represented by [BetType, stake, number[]].
 * @param number The winning number in the roulette game.
 * @returns The calculated payout amount.
 */
function calcPayout(bet: bet, number: number): number{
    const typeOfBet: BetType = bet[0];
    return typeOfBet === "Single" ? calcSingle(bet[2], bet[1], number) :
           typeOfBet === "Split" ? calcSplit(bet[2], bet[1], number) :
           typeOfBet === "Street" ? calcStreet(bet[2], bet[1], number) :
           typeOfBet === "Corner" ? calcCorner(bet[2], bet[1], number) :
           typeOfBet === "DoubleStreet" ? calcDoubleStreet(bet[2], bet[1], number) :
           typeOfBet === ("Red" || "Black") ? calcRedOrBlack(typeOfBet, bet[1], number) :
           typeOfBet === ("Even" || "Odd") ? calcEvenOrOdd(typeOfBet, bet[1], number) :
           typeOfBet === ("Low" || "High") ? calcLowOrHigh(typeOfBet, bet[1], number) :
           typeOfBet ===  (1 || 2 || 3) ? calcColumns(typeOfBet, bet[1], number) :
           typeOfBet ===  (4 || 5 || 6) ? calcDozens(typeOfBet, bet[1], number) :
           0;
}


/**
 * Calculates the payout for a bet on a single number.
 * @param bet An array of bets placed, where each bet is 
 *            represented by [BetType, stake, number[]].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcSingle(bet: number[], stake: stake, number: number): number{
    return bet[0] === number ? stake * 36 : 0;
}


/**
 * Calculates the payout for a bet on two adjacent numbers.
 * @param bet An array of bets placed, where each bet is 
 *            represented by [BetType, stake, number[]].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcSplit(bet: number[], stake: stake, number: number): number {
    return bet[0] === number ? stake * 18 : bet[1] === number ? stake * 18 : 0;
}


/**
 * Calculates the payout for a bet on a street. This is three consecutive
 *  numbers in a horizontal line.
 * @param bet An array of bets placed, where each bet is 
 *            represented by [BetType, stake, number[]].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcStreet(bet: number[], stake: stake, number: number): number {
    return (number >= bet[0] && number <= bet[0] + 3) ? stake * 12 : 0;
}


/**
 * Calculates the payout for a bet on a corner. This is when four numbers meet
 * at one corner.
 * @param bet An array of bets placed, where each bet is 
 *            represented by [BetType, stake, number[]].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcCorner(bet: number[], stake: stake, number: number): number {
    return (number >= bet[0] && number <= bet[0] + 4) ? stake * 8 : 0;
}


/**
 * Calculates the payout for a bet placed on a double street. This is six 
 * consecutive numbers that form two horizontal lines.
 * @param bet An array of bets placed, where each bet is 
 *            represented by [BetType, stake, number[]].
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcDoubleStreet(bet: number[], stake: stake, number: number): number {
    return (number >= bet[0] && number <= bet[0] + 5) ? stake * 6 : 0;
}


/**
 * Calculates the payout for a bet placed on either red or black. 
 * @param redOrBlack The color selected for the bet.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcRedOrBlack(redOrBlack: Color, stake: stake, number: number): number {
    if (redOrBlack === Color.Red)  {
        if (redNumbers.includes(number)) {
            return stake * 2;
        } else {
            return 0;
        }
    } else {
        if (!redNumbers.includes(number)) {
            return stake * 2;
        } else {
            return 0;
        }
    }
}


/**
 * Calculates the payout for a bet placed on either even or odd. 
 * @param evenOrOdd The type of selection for the bet, either even or odd.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcEvenOrOdd(evenOrOdd: EvenOdd, stake: stake, number: number): number {
    if (evenOrOdd === EvenOdd.Even) {
        if (number % 2 === 0) {
            return stake * 2;
        } else {
            return 0;
        }
    } else {
        if (number % 2 === 1) {
            return stake * 2;
        } else {
            return 0;
        }
    }
}


/**
 * Calculates the payout for a bet placed on either low or high. 
 * @param lowOrHigh The range of selection for the bet, either low or high.
 * @param stake The amount of stake placed on the bet.
 * @param number The winning number in the roulette game.
 * @returns The payout for the placed bet.
 */
function calcLowOrHigh(lowOrHigh: LowHigh, stake: stake, number: number): number {
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
function calcColumns(column: Columns, stake: stake, number: number): number {
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
function calcDozens(dozens: Dozens, stake: stake, number: number): number {
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

playerMove({name: "Viktor", password: "HIDSIODSHDHIOS", balance: 2000, hand: []});