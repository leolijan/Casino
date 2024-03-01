import { calcSingle, calcSplit, calcStreet, calcCorner, calcDoubleStreet, 
         bet ,calcRedOrBlack, calcEvenOrOdd, EvenOdd, Color, calcLowOrHigh, 
         LowHigh, calcColumns, calcDozens, playerMove, calcPayout, addBetAmount, 
         BetType, calculateWinnings} from './roulette'; // Adjust import path as necessary
import { head, list, List, pair, tail, is_null, to_string as display_list } from '../../lib/list';
import { Person, createPerson } from '../../Player/Player';
import * as userInputModule from '../../userInput/readUserInput'; // Adjust the import path as necessary
// Mock data for bets
const singleBet: bet = ["Single", 100, [17]];
const splitBet: bet = ["Split", 100, [17, 20]];
const streetBet: bet = ["Street", 100, [1]]; // Assuming street bet is identified by the first number in the street
const cornerBet: bet = ["Corner", 100, [17, 18, 20, 21]];
const doubleStreetBet: bet = ["DoubleStreet", 100, [1, 2]]; // Assuming double street bet is identified by the two streets' starting numbers

describe('calcSingle', () => {
    test('wins on correct number', () => {
        const payout = calcSingle(singleBet[2], singleBet[1], 17);
        expect(payout).toBe(3600); // Assuming the payout for a single bet is stake * 36
    });

    test('loses on incorrect number', () => {
        const payout = calcSingle(singleBet[2], singleBet[1], 18);
        expect(payout).toBe(0);
    });
});

describe('calcSplit', () => {
    test('wins on first number', () => {
        const payout = calcSplit(splitBet[2], splitBet[1], 17);
        expect(payout).toBe(1800); // Assuming the payout for a split bet is stake * 18
    });

    test('wins on second number', () => {
        const payout = calcSplit(splitBet[2], splitBet[1], 20);
        expect(payout).toBe(1800);
    });

    test('loses on incorrect number', () => {
        const payout = calcSplit(splitBet[2], splitBet[1], 22);
        expect(payout).toBe(0);
    });

    test('attempt split bet on non-adjacent numbers', () => {
        const nonAdjacentSplitBet: bet = ["Split", 100, [1, 3]]; // Non-adjacent numbers
        const winningNumber = 1;
        const payout = calcSplit(nonAdjacentSplitBet[2], nonAdjacentSplitBet[1], winningNumber);
        expect(payout).toBe(0); // Expect no payout for invalid split bet
    });

    test('split bet includes number outside roulette table range', () => {
        const invalidSplitBet: bet = ["Split", 100, [1, 37]]; // 37 is outside standard roulette numbers
        const winningNumber = 1;
        const payout = calcSplit(invalidSplitBet[2], invalidSplitBet[1], winningNumber);
        expect(payout).toBe(0); // Expect no payout for invalid bet
    });
});

describe('calcStreet', () => {
    test('wins on number within street', () => {
        const streetIndex = 0; // Assuming the first street [1, 2, 3] for simplicity
        const stake = 100;
        const number = 2; // Number within the first street
        const payout = calcStreet([streetIndex], stake, number);
        expect(payout).toBe(1200); // stake * 12 for winning
    });

    test('loses on number outside street', () => {
        const streetIndex = 0; // Still assuming the first street [1, 2, 3]
        const stake = 100;
        const number = 4; // Number not within the first street
        const payout = calcStreet([streetIndex], stake, number);
        expect(payout).toBe(0); // No payout for losing bet
    });
});

describe('calcCorner', () => {
    test('wins on number within corner', () => {
        // Assuming the correct input for a corner bet
        const payout = calcCorner([16,17,19,20], 100, 17); // Corner bet includes number 17
        expect(payout).toBe(800); // Expecting a win with payout = stake * 8
    });

    test('loses on number outside corner', () => {
        const payout = calcCorner([16,17,19,20], 100, 15); // Number 15 is not part of the corner bet
        expect(payout).toBe(0);
    });
});

describe('calcDoubleStreet', () => {
    test('wins on number within first street of double street', () => {
        // Assuming indexes for the first and second streets
        const firstStreetIndex = 0; // For street [1, 2, 3]
        const secondStreetIndex = 1; // For street [4, 5, 6]
        const stake = 100;
        const winningNumber = 2; // Number within the first street
        const payout = calcDoubleStreet([firstStreetIndex, secondStreetIndex], stake, winningNumber);
        expect(payout).toBe(600); // Expecting a win with payout = stake * 6
    });

    test('wins on number within second street of double street', () => {
        // Assuming indexes for the first and second streets
        const firstStreetIndex = 0; // For street [1, 2, 3]
        const secondStreetIndex = 1; // For street [4, 5, 6]
        const stake = 100;
        const winningNumber = 5; // Number within the second street
        const payout = calcDoubleStreet([firstStreetIndex, secondStreetIndex], stake, winningNumber);
        expect(payout).toBe(600);
    });

    test('loses on number outside of double streets', () => {
        // Assuming indexes for the first and second streets
        const firstStreetIndex = 0; // For street [1, 2, 3]
        const secondStreetIndex = 1; // For street [4, 5, 6]
        const stake = 100;
        const losingNumber = 7; // Number not in either street
        const payout = calcDoubleStreet([firstStreetIndex, secondStreetIndex], stake, losingNumber);
        expect(payout).toBe(0);
    });
});

describe('calcSingle', () => {
    test('wins on exact match', () => {
        const betNumbers = [17]; // Betting on 17
        const stake = 100;
        const winningNumber = 17;
        const payout = calcSingle(betNumbers, stake, winningNumber);
        expect(payout).toBe(3600); // stake * 36 for a single number win
    });

    test('loses on no match', () => {
        const betNumbers = [17]; // Betting on 17
        const stake = 100;
        const losingNumber = 18;
        const payout = calcSingle(betNumbers, stake, losingNumber);
        expect(payout).toBe(0);
    });
});

describe('calcRedOrBlack', () => {
    test('wins on red bet', () => {
        const betColor = Color.Red;
        const stake = 100;
        const winningNumber = 3; // Assuming 3 is red
        const payout = calcRedOrBlack(betColor, stake, winningNumber);
        expect(payout).toBe(200); // stake * 2 for red/black bet win
    });

    test('loses on red bet when black wins', () => {
        const betColor = Color.Red;
        const stake = 100;
        const losingNumber = 4; // Assuming 4 is black
        const payout = calcRedOrBlack(betColor, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('bet on a non-existing number', () => {
        const stake = 100;
        const nonExistingNumber = 0; // Assuming 0 is not red or black
        const payoutRed = calcRedOrBlack(Color.Red, stake, nonExistingNumber);
        const payoutBlack = calcRedOrBlack(Color.Black, stake, nonExistingNumber);
        expect(payoutRed).toBe(0);
        expect(payoutBlack).toBe(0);
    });
});

describe('calcEvenOrOdd', () => {
    test('wins on even bet', () => {
        const betType = EvenOdd.Even;
        const stake = 100;
        const winningNumber = 4; // An even number
        const payout = calcEvenOrOdd(betType, stake, winningNumber);
        expect(payout).toBe(200); // stake * 2 for an even/odd bet win
    });

    test('loses on even bet when odd wins', () => {
        const betType = EvenOdd.Even;
        const stake = 100;
        const losingNumber = 5; // An odd number
        const payout = calcEvenOrOdd(betType, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('bet on zero', () => {
        const stake = 100;
        const zeroNumber = 0; // Zero is neither even nor odd
        const payoutEven = calcEvenOrOdd(EvenOdd.Even, stake, zeroNumber);
        const payoutOdd = calcEvenOrOdd(EvenOdd.Odd, stake, zeroNumber);
        expect(payoutEven).toBe(0);
        expect(payoutOdd).toBe(0);
    });
});

describe('calcLowOrHigh', () => {
    test('wins on low bet', () => {
        const betType = LowHigh.Low;
        const stake = 100;
        const winningNumber = 1; // A low number (1-18)
        const payout = calcLowOrHigh(betType, stake, winningNumber);
        expect(payout).toBe(200); // Expecting payout = stake * 2 for a low/high bet win
    });

    test('loses on low bet when high wins', () => {
        const betType = LowHigh.Low;
        const stake = 100;
        const losingNumber = 19; // A high number (19-36)
        const payout = calcLowOrHigh(betType, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('bet on edge low number', () => {
        const stake = 100;
        const lowEdgeNumber = 18; // Highest low number
        const payoutLow = calcLowOrHigh(LowHigh.Low, stake, lowEdgeNumber);
        expect(payoutLow).toBe(200);
    });

    test('bet on edge high number', () => {
        const stake = 100;
        const highEdgeNumber = 19; // Lowest high number
        const payoutHigh = calcLowOrHigh(LowHigh.High, stake, highEdgeNumber);
        expect(payoutHigh).toBe(200);
    });
});

describe('calcColumns', () => {
    test('wins on first column bet', () => {
        const columnBet = 1; // First column (1, 4, 7, ..., 34)
        const stake = 100;
        const winningNumber = 4; // Assuming 4 is in the first column
        const payout = calcColumns(columnBet, stake, winningNumber);
        expect(payout).toBe(300); // Expecting payout = stake * 3 for a column bet win
    });

    test('loses on first column bet when number is outside', () => {
        const columnBet = 1;
        const stake = 100;
        const losingNumber = 2; // Assuming 2 is not in the first column
        const payout = calcColumns(columnBet, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('bet on correct column', () => {
        const columnBet = 1; // Assuming first column
        const stake = 100;
        const winningNumber = 1; // Number in the first column
        const payout = calcColumns(columnBet, stake, winningNumber);
        expect(payout).toBe(300);
    });
});

describe('calcDozens', () => {
    test('wins on first dozen bet', () => {
        const dozenBet = 4; // First dozen (1-12) adjusted for your enums starting at 4
        const stake = 100;
        const winningNumber = 11; // A number in the first dozen
        const payout = calcDozens(dozenBet, stake, winningNumber);
        expect(payout).toBe(300); // Expecting payout = stake * 3 for a dozen bet win
    });

    test('loses on first dozen bet when number is outside', () => {
        const dozenBet = 4; // First dozen adjusted for your enums
        const stake = 100;
        const losingNumber = 13; // A number not in the first dozen
        const payout = calcDozens(dozenBet, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('bet on correct dozen', () => {
        const dozenBet = 4; // Assuming first dozen (1-12) adjusted to match your enum starting at 4
        const stake = 100;
        const winningNumber = 12; // Number in the first dozen
        const payout = calcDozens(dozenBet, stake, winningNumber);
        expect(payout).toBe(300);
    });
});

describe('calcPayout', () => {
    // Example bet setup for tests
    const singleBet: bet = ["Single", 100, [17]];
    const number = 17; // Winning number for this test case
  
    test('correctly calculates payout for a Single bet', () => {
      const payout = calcPayout(singleBet, number);
      expect(payout).toBe(3600); // Assuming the payout for a Single bet is stake * 36
    });
  
    // Add more tests for other bet types (Split, Street, Corner, etc.)
    // Example for a Split bet
    const splitBet: bet = ["Split", 100, [17, 18]];
    test('correctly calculates payout for a Split bet', () => {
      const payout = calcPayout(splitBet, number);
      expect(payout).toBe(1800); // Assuming the payout for a Split bet is stake * 18
    });
  
    // Continue with tests for Street, Corner, DoubleStreet, Red/Black, Even/Odd, Low/High, Columns, Dozens
  
    // Example for an invalid bet type
    test('returns 0 for an invalid bet type', () => {
      const invalidBet: bet = ["InvalidType" as BetType, 100, [17]]; // Cast to BetType to simulate invalid type
      const payout = calcPayout(invalidBet, number);
      expect(payout).toBe(0); // Expecting 0 for an invalid bet type
    });
  });

describe('calculateWinnings', () => {
    const winningNumber = 17;
    
    test('calculates total winnings for a single bet', () => {
      const singleBet: bet = ["Single", 100, [17]];
      const bets: List<bet> = list(singleBet);
      const totalWinnings = calculateWinnings(bets, winningNumber);
      expect(totalWinnings).toBe(3600); // Assuming the payout for a Single bet is stake * 36
    });
  
    test('calculates total winnings for multiple bets', () => {
      const betsList: List<bet> = list(
        ["Single", 100, [17]], // Winning bet
        [Color.Red, 100, []], // Losing bet, assuming 17 is not Red
        ["Split", 100, [16, 17]] // Winning bet
      );
      // Assuming payouts are 3600 for the Single, 0 for the Red (losing), and 1800 for the Split
      const totalWinnings = calculateWinnings(betsList, winningNumber);
      expect(totalWinnings).toBe(5400); // Total winnings from both winning bets
    });
  
    test('returns 0 for no bets', () => {
      const noBets: List<bet> = list();
      const totalWinnings = calculateWinnings(noBets, winningNumber);
      expect(totalWinnings).toBe(0); // Expecting 0 for no bets
    });
  
    // You can add more tests to cover other edge cases or scenarios
});

jest.mock('../../userInput/readUserInput', () => ({
    readUserInput: jest.fn(),
  }));
  
describe('addBetAmount', () => {
    test('updates person balance and bet stake based on user input', async () => {
        const mockBet: bet = ['', 0, []];
        const mockPerson: Person = { name: 'John Doe', password : '1', balance: 500, hand: [] };
        const mockStake = 100;
        (userInputModule.readUserInput as jest.Mock).mockResolvedValue(mockStake.toString());
  
        await addBetAmount(mockPerson);
  
        expect(mockBet[1]).toBe(mockStake);
        expect(mockPerson.balance).toBe(400); // Assuming the person had a balance of 500 and bet 100
        expect(userInputModule.readUserInput).toHaveBeenCalledWith("How much would you like to bet? \n", 500);
    });
});

//det som är kvar är resten av prompt funktionerna
