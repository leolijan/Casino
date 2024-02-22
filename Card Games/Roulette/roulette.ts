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

// bettype, money betted, numbers betted on
export type bet = [BetType, stake, Array<number>];


// Global variable to keep track of all red numbers:
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 
                    19, 21, 23, 25, 27, 30, 32, 34, 36];
const streets = [[1,2,3],[4,5,6],[7,8,9],[10,11,12],[13,14,15],[16,17,18],[19,20,21],
                 [22,23,24],[25,26,27],[28,29,30],[31,32,33],[34,35,36]];


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


async function read_user_input(prompt: string, max: number): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let koll = true;

    const retur = await new Promise<string>((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
            if(answer==="x"|| answer==="X") {
                process.exit();
            }
            if(!check(answer, max)){
                console.log("WRONG INPUT");
                koll = false;
            }
            
        });
    });

    return koll ? retur : read_user_input(prompt, max);
}

function check(answer: string, max: number): boolean{
    for(let i = 1; i<max+1; i++){
        if(answer===i.toString()){
            return true;
        }
    }
    return false;
}


function print_options(options: {[key: string]: string}): void {
    for (const [key, value] of Object.entries(options)) {
        console.log(`${key}) ${value}`);
    }
}
async function playerMove(person: Person) {
    // could add print_options from login
    const bet: bet = ["",0,[]];
    console.log(person.name);

    // type of bet:
    // 1. numbers bet (single, split, street, corner, doublestreet)
    // 2. even bets (RedBlack, EvenOdd, LowHigh)
    // 3. Columns or dozens
        const options = "1. numbers bet (single, split, street, corner, doublestreet)\n2. even bets (RedBlack, EvenOdd, LowHigh)\n3. Columns or dozens\n";
        let userInput = await read_user_input(options, 3);
        if(userInput==="1"){
            await numberBet(bet);
        }else if(userInput==="2"){
            await evenBets(bet);
        }else{
            await columnsAndDozensBet(bet);
        }
    console.log(bet);
    
    // place bets and register bets

    await addBetAmount();

    userInput = await read_user_input("want to bet more?: Yes(1) or No(2)\n", 2);
    if(userInput==="1"){
        // spin the wheel and call the calculatewinnings functions and register the payout to the account
        playerMove(person);
    }else{}
}


async function numberBet(bet: bet){
    let inp = await read_user_input("Choose single (1), split (2), street (3), corner (4) or doublestreet (5)\n", 5);
    const availableBets = [];
        if(inp==="1") {
            //single
            inp = await read_user_input("choose number: ", 36);
            bet[0]= "Single";
            bet[2][0] = Number(inp);
        }else if(inp === "2") {
            //split 
            let amount = 0;
            inp = await read_user_input("choose first number: ", 36);   
            bet[0] = "Split";  
            const first = Number(inp);
            bet[2][0]=first;
            const numbers: number[] = [];
            if(first%3===0){
                //high up
                amount = numbers.push(first-1, first+3, first-3);
            }else if(first%3===1){
                //lowest
                amount = numbers.push(first+1, first+3, first-3);
            }else{
                //mitten
                amount = numbers.push(first-1, first+1, first+3, first-3);
            }
            let str = "choose second number: ";
            console.log(numbers);
            let moved = 0;
            
            for(let i = 0; i < amount; i++){
                if(numbers[i]<1||numbers[i]>36){
                    //amount--;
                    moved++;
                    numbers[i]=-1;
                }else{
                    str += "nr: " + numbers[i].toString() + " (" + (i-moved+1).toString() + "), ";
                }
            }
            console.log(numbers);
            
            str += "\n"
            
            inp = await read_user_input(str, amount);  
            const second = Number(inp); 
            bet[2][1] = numbers[second-1]===-1 ? numbers[second] : numbers[second-1];
            console.log(bet[2]);
            
        }else if(inp === "3"){
            //street 
            inp = await read_user_input("Choose street: (1-12): \n", 12); 
            bet[0] = "Street"; 
            bet[2][0] = Number(inp);
        }else if(inp === "4"){
            //corner
            inp = await read_user_input("choose first number: \n", 36);
            bet[0]= "Corner";
            const first = Number(inp);
            // idea:
            // go right left to only have two options
            // then up for option 1 and down for option 2
            let second;
            if(first-3<1){
                // go right
                second = first + 3;
            }else if(first+3>36){
                // go left
                second = first - 3;
            }else{
                inp = await read_user_input("go left (1) or right (2): \n", 2);  
                second = Number(inp) === 1 ? first - 3 : first + 3;
            }
            // up (first,first-1,second,second-1)
            // down (first,first+1,second,second+1)
            inp = await read_user_input("go up (1): ("+ (first).toString() + "," + (first-1).toString() + "," + (second-1).toString() + "," + (second).toString() + ")" + 
                                        " or down (2): ("+ (first).toString() + "," + (first+1).toString() + "," + (second+1).toString() + "," + (second).toString() + "): \n", 2);
            bet[2] = Number(inp) === 1 ? [first,first-1,second,second-1] : [first,first+1,second,second+1];
        }else if(inp === "5"){
            //doublestreet
            bet[0]= "DoubleStreet";
            inp = await read_user_input("Choose first street (1-12):\n", 12);  
            const first = Number(inp);
            bet[2][0]=first;

            //CHECK IF STREET IS OUTSIDE OF SCOPE
            inp = await read_user_input("Choose second street: street " + (first-1).toString() + " (1) or street " + (first+1).toString()+ " (2):\n",
                                        2);
            bet[2][1] = Number(inp)===1 ? first-1 : first+1;
        }else{} 
}

async function evenBets(bet: bet){
    let inp = await read_user_input("Choose red/black (1), even/odd (2) or low/high (3)\n", 3);
        if(inp==="1") {
            //red/black
                inp = await read_user_input("Choose red numbers (1): \n(1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36)\n"+
                                            "Choose black number (2): \n(2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35)\n", 2);
                if(inp === "1"){
                    bet[0] = Color.Red;
                }else if(inp === "2"){
                    bet[0] = Color.Black;
                }else{}
        }else if(inp === "2") {
            //even/odd
                inp = await read_user_input("Choose even numbers (1): \n"+
                                            "Choose odd numbers (2): \n", 2);
                if(inp === "1"){
                    bet[0] = EvenOdd.Even;
                }else if(inp === "2"){
                    bet[0] = EvenOdd.Odd;
                }else{}
        }else if(inp === "3"){
            //low/high
            inp = await read_user_input("Choose low numbers (1): (1-18)\n"+
                                        "Choose odd numbers (2): (19-36)\n", 2);
            if(inp === "1"){
                bet[0] = LowHigh.Low;
            }else if(inp === "2"){
                bet[0] = LowHigh.High;
            }else{}
        }else{} 
}

async function columnsAndDozensBet(bet: bet): Promise<void>{
        let inp = await read_user_input("Choose columns (1) or dozens (2): \n", 2);
        if(inp==="1") {
            //columns
                inp = await read_user_input("Choose column 1: (1,4,7,10,...,34)\n"+
                                            "Choose column 2: (2,5,8,11,...,35)\n"+
                                            "Choose column 3: (3,6,9,12,...,36)\n", 3);
                if(inp === "1"){
                    bet[0] = 1;
                }else if(inp === "2"){
                    bet[0] = 2;
                }else if(inp === "3"){
                    bet[0] = 3;
                }else{}
        }else if(inp === "2") {
            //dozens
                inp = await read_user_input("Choose dozen 1: (1-12)\n"+
                                            "Choose dozen 2: (13-24)\n"+
                                            "Choose dozen 3: (25-36)\n", 3);
                if(inp === "1"){
                    bet[0] = 4;
                }else if(inp === "2"){
                    bet[0] = 5;
                }else if(inp === "3"){
                    bet[0] = 6;
                }else{
                }
        }else{}   
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
    return (streets[bet[0]].includes(number)) ? stake * 12 : 0;
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
    return (streets[bet[0]].includes(number)||streets[bet[1]].includes(number)) ? stake * 6 : 0;
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