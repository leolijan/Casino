import * as readline from 'readline';

import { Person, createPerson } from '../../Player/Player';



// All possible bets
type BetType = EvenMoney | TwoToOne | Rest;

// All of the bets where you win the same amount you bet.
type EvenMoney = Color | Low | High | Even | Odd;
enum Color {
    Red = 'Red', 
    Black = 'Black'
}
type Low = 'Low';
type High = 'High';
type Even = 'Even';
type Odd = 'Odd';

// The bets where you win twize the amount you bet. 
type TwoToOne = Columns | Dozens;
type Dozens = 1 | 2 | 3;
type Columns = 1 | 2 | 3;

// The rest of the bets with different odds
type Rest = Single | Split | Street | Corner | DoubleStreet;
type Single = number;
type Split = [number, number];
type Street = [number, number, number];
type Corner = [number, number, number, number]
type DoubleStreet = [number, number, number, number, number, number];


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

function playerMove(person: Person) {
    
}