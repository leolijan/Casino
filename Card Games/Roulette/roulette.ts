import * as readline from 'readline';
import { Person, createPerson } from '../../Player/Player';


// All possible bets
type BetType = EvenMoney | TwoToOne | Rest | "";


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


// The bets where you win twize the amount you bet.
type TwoToOne = Columns | Dozens;
type Columns = 1 | 2 | 3;
type Dozens = 4 | 5 | 6;




// The rest of the bets with different odds
type Rest = "Single" | "Split" | "Street" | "Corner" | "DoubleStreet";


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
type Single = number;
type Split = [number, number];
type Street = [number, number, number];
type Corner = [number, number, number, number]
type DoubleStreet = [number, number, number, number, number, number];


// rest(type of bet), money betted, numbers betted on
export type bet = [BetType, stake, []];


// Global variable:
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];




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
            columnsAndDozensBet();
        }else{
            continue;
        }
        // place bets and register bets



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


async function columnsAndDozensBet(): Promise<void>{
    while(true){
        const inp = await read_user_input("Choose columns (1) or dozens (2)");
        if(inp==="1"){
            //columns
        }else if(inp==="2"){
            //dozens
        }else{
            continue;
        }
        
    }

}


function calculateWinnings(bets: bet[], number: number): number{
    let payout = 0;


    for(let i = 0; i < bets.length; i++){
        payout += calcPayout(bets[i], number);
    }
   
    return payout;
}


function calcPayout(bet: bet, number: number): number{
    const typeOfBet: BetType = bet[0]
    return typeOfBet === "Single" ? calcSingle(bet[2], bet[1], number) :
           typeOfBet === "Split" ? calcSplit(bet[2], bet[1], number) :
           typeOfBet === "Street" ? calcStreet(bet[2], bet[1], number) :
           typeOfBet === "Corner" ? calcCorner(bet[2], bet[1], number) :
           typeOfBet === "DoubleStreet" ? calcDoubleStreet(bet[2], bet[1], number) :
           typeOfBet === ("Red" || "Black") ? calcRedOrBlack(typeOfBet, bet[1], number) :
           typeOfBet === (EvenOdd.Even || EvenOdd.Odd) ? calcEvenOrOdd(typeOfBet, bet[1], number) :
           typeOfBet === (LowHigh.Low || LowHigh.High) ? calcLowOrHigh(typeOfBet, bet[1], number) :
           typeOfBet ===  (1 || 2 || 3) ? calcColumns(typeOfBet, bet[1], number) :
           typeOfBet ===  (4 || 5 || 6) ? calcDozens(typeOfBet, bet[1], number) :
           0;
}


function calcSingle(bet: number[], stake: stake, number: number): number{
    return bet[0] === number ? stake*36 : 0;
}


function calcSplit(bet: number[], stake: stake, number: number): number {
    return bet[0] === number ? stake*18 : bet[1] === number ? stake*18 : 0;
}


function calcStreet(bet: number[], stake: stake, number: number): number {
    return number>=bet[0] && number<=bet[0]+3 ? stake*12 : 0;
}


function calcCorner(bet: number[], stake: stake, number: number): number {
    return number>=bet[0] && number<=bet[0]+4 ? stake*8 : 0;
}


function calcDoubleStreet(bet: number[], stake: stake, number: number): number {
    return number>=bet[0] && number<=bet[0]+5 ? stake*6 : 0;
}


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


function calcColumns(column: Columns, stake: stake, number: number): number {
    if ((number - column) % 3 === 0) {
        return stake * 3;
    } else {
        return 0;
    }




}


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


playerMove({name: "h", password: "HIDSIODSHDHIOS", balance: 2000, hand: []});
