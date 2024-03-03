import {
  calcSingle, calcSplit, calcStreet, calcCorner, calcDoubleStreet,
  bet, calcRedOrBlack, calcEvenOrOdd, EvenOdd, Color, calcLowOrHigh,
  LowHigh, calcColumns, calcDozens, playerMove, calcPayout, addBetAmount,
  BetType, calculateWinnings, numberBet, columnsAndDozensBet, evenBets,
  buildABet, spin, startGame, computerMove
} from './roulette';

import {
  head, list, List, pair, tail, is_null, to_string as displayList, empty_list
} from '../../lib/list';

import { Person, createPerson } from '../../Player/Player';
import {readUserInput} from '../../userInput/readUserInput';

describe('spin', () => {
    test('returns a number between 0 and 36', () => {
        // Large number of iterations for statistical significance
        const iterations = 10000; 
        const results = [];

        for (let i = 0; i < iterations; i++) {
        results.push(spin());
        }
        // Verify all results are within the expected range
        const ResultsWithinRange = results.every(num => num >= 0 && num <= 36);

        expect(ResultsWithinRange).toBe(true);

        const uniqueResults = new Set(results);
        // Ensure multiple unique results
        expect(uniqueResults.size).toBeGreaterThan(1); 
        expect(Math.min(...results)).toBe(0); // Check for 0 in results
        expect(Math.max(...results)).toBe(36); // Check for 36 in results
    });
});

describe('calcSingle', () => {
    const singleBet: bet = ["Single", 100, [17]];
    test('wins on correct number', () => {
        const payout = calcSingle(singleBet[2], singleBet[1], 17);
        expect(payout).toBe(3600); 
    });

    test('loses on incorrect number', () => {
        const payout = calcSingle(singleBet[2], singleBet[1], 18);
        expect(payout).toBe(0);
    });
});

describe('calcSplit', () => {
    // Define a split bet according to the roulette game rules
    const splitBet: bet = ["Split", 100, [17, 20]];
  
    test('wins on first number', () => {
      // Calculate payout for winning on the first number of the split bet
      const payout = calcSplit(splitBet[2], splitBet[1], 17);
      // Expect payout to be stake * 18 for a split bet win
      expect(payout).toBe(1800); 
    });
  
    test('wins on second number', () => {
      // Calculate payout for winning on the second number of the split bet
      const payout = calcSplit(splitBet[2], splitBet[1], 20);
      expect(payout).toBe(1800);
    });
  
    test('loses on incorrect number', () => {
      // Calculate payout for betting on a number not part of the split bet
      const payout = calcSplit(splitBet[2], splitBet[1], 22);
      expect(payout).toBe(0); // No payout expected for a loss
    });
  
    test('attempt split bet on non-adjacent numbers', () => {
      // Define a bet on non-adjacent numbers, which is considered invalid
      const nonAdjacentSplitBet: bet = ["Split", 100, [1, 3]];
      const winningNumber = 1;
      // Calculate payout, expecting no payout for an invalid split bet
      const payout = calcSplit(nonAdjacentSplitBet[2], 
                               nonAdjacentSplitBet[1], 
                               winningNumber);
      expect(payout).toBe(0); 
    });
  
    test('split bet includes number outside roulette table range', () => {
      // Define a split bet that includes a number outside the standard roulette range
      const invalidSplitBet: bet = ["Split", 100, [1, 37]];
      const winningNumber = 1;
      // Calculate payout, expecting no payout for a bet with invalid number
      const payout = calcSplit(invalidSplitBet[2], 
                               invalidSplitBet[1], 
                               winningNumber);
      expect(payout).toBe(0); 
    });
  });
  
describe('calcStreet', () => {
    test('wins on number within street', () => {
        const streetIndex = 0; //[1, 2, 3] for simplicity
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
         // Corner bet includes number 17
        const payout = calcCorner([16,17,19,20], 100, 17);
        expect(payout).toBe(800); // Expecting a win with payout = stake * 8
    });

    test('loses on number outside corner', () => {
        // Number 15 is not part of the corner bet
        const payout = calcCorner([16,17,19,20], 100, 15); 
        expect(payout).toBe(0);
    });
});

describe('calcDoubleStreet', () => {
    test('wins on number within first street of double street', () => {
        const firstStreetIndex = 0; // For street [1, 2, 3]
        const secondStreetIndex = 1; // For street [4, 5, 6]
        const stake = 100;
        const winningNumber = 2; // Number within the first street
        const payout = calcDoubleStreet([firstStreetIndex, secondStreetIndex], 
                                        stake, winningNumber);
        expect(payout).toBe(600); //payout = stake * 6
    });

    test('wins on number within second street of double street', () => {
        const firstStreetIndex = 0; // For street [1, 2, 3]
        const secondStreetIndex = 1; // For street [4, 5, 6]
        const stake = 100;
        const winningNumber = 5; // Number within the second street
        const payout = calcDoubleStreet([firstStreetIndex, secondStreetIndex], 
                                        stake, winningNumber);
        expect(payout).toBe(600);
    });

    test('loses on number outside of double streets', () => {
        const firstStreetIndex = 0; // For street [1, 2, 3]
        const secondStreetIndex = 1; // For street [4, 5, 6]
        const stake = 100;
        const losingNumber = 7; // Number not in either street
        const payout = calcDoubleStreet([firstStreetIndex, secondStreetIndex], 
                                        stake, losingNumber);
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
        const winningNumber = 3; 
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
        const nonExistingNumber = 0; 
        const payoutRed = calcRedOrBlack(Color.Red, stake, nonExistingNumber);
        const payoutBlack = calcRedOrBlack(Color.Black, stake, 
                                           nonExistingNumber);
        expect(payoutRed).toBe(0);
        expect(payoutBlack).toBe(0);
    });

    test('wins on black bet', () => {
        const betColor = Color.Black;
        const stake = 100;
        const winningNumber = 4; // Assuming 4 is black
        const payout = calcRedOrBlack(betColor, stake, winningNumber);
        expect(payout).toBe(200); // Expecting payout = stake * 2 
    });

    test('loses on black bet when red wins', () => {
        const betColor = Color.Black;
        const stake = 100;
        const losingNumber = 3; // Assuming 3 is red
        const payout = calcRedOrBlack(betColor, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('bet on 37 (representing 00)', () => {
        const stake = 100;
        const specialNumber = 37; 
        const payoutRed = calcRedOrBlack(Color.Red, stake, specialNumber);
        const payoutBlack = calcRedOrBlack(Color.Black, stake, specialNumber);
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

    test('wins on odd bet', () => {
        const betType = EvenOdd.Odd;
        const stake = 100;
        const winningNumber = 3; // An odd number
        const payout = calcEvenOrOdd(betType, stake, winningNumber);
        expect(payout).toBe(200); // Expecting payout = stake * 2 
    });

    test('loses on odd bet when even wins', () => {
        const betType = EvenOdd.Odd;
        const stake = 100;
        const losingNumber = 2; // An even number
        const payout = calcEvenOrOdd(betType, stake, losingNumber);
        expect(payout).toBe(0);
    });

    // Edge cases
    test('lowest even number (2) win', () => {
        const betType = EvenOdd.Even;
        const stake = 100;
        const winningNumber = 2; // Lowest even number
        const payout = calcEvenOrOdd(betType, stake, winningNumber);
        expect(payout).toBe(200);
    });

    test('highest odd number (35) win', () => {
        const betType = EvenOdd.Odd;
        const stake = 100;
        const winningNumber = 35; // Highest odd number within 1-36 range
        const payout = calcEvenOrOdd(betType, stake, winningNumber);
        expect(payout).toBe(200);
    });

    test('edge even number (36) win', () => {
        const betType = EvenOdd.Even;
        const stake = 100;
        const winningNumber = 36; // Highest even number within 1-36 range
        const payout = calcEvenOrOdd(betType, stake, winningNumber);
        expect(payout).toBe(200);
    });

    test('edge odd number (1) win', () => {
        const betType = EvenOdd.Odd;
        const stake = 100;
        const winningNumber = 1; // Lowest odd number
        const payout = calcEvenOrOdd(betType, stake, winningNumber);
        expect(payout).toBe(200);
    });
});

describe('calcLowOrHigh', () => {
    test('wins on low bet', () => {
        const betType = LowHigh.Low;
        const stake = 100;
        const winningNumber = 1; // A low number (1-18)
        const payout = calcLowOrHigh(betType, stake, winningNumber);
        expect(payout).toBe(200); // Expecting payout = stake * 2 
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

    test('wins on high bet', () => {
        const betType = LowHigh.High;
        const stake = 100;
        const winningNumber = 36; // A high number (19-36)
        const payout = calcLowOrHigh(betType, stake, winningNumber);
        expect(payout).toBe(200); // Expecting payout = stake * 2 
    });

    test('loses on high bet when low wins', () => {
        const betType = LowHigh.High;
        const stake = 100;
        const losingNumber = 1; // A low number (1-18)
        const payout = calcLowOrHigh(betType, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('bet on zero with high bet results in loss', () => {
        const betType = LowHigh.High;
        const stake = 100;
        const zeroNumber = 0; // Zero is neither low nor high
        const payout = calcLowOrHigh(betType, stake, zeroNumber);
        expect(payout).toBe(0);
    });
});

describe('calcColumns', () => {
    test('wins on first column bet', () => {
        const columnBet = 1; // First column (1, 4, 7, ..., 34)
        const stake = 100;
        const winningNumber = 4; // 4 is in the first column
        const payout = calcColumns(columnBet, stake, winningNumber);
        expect(payout).toBe(300); // Expecting payout = stake * 3 
    });

    test('loses on first column bet when number is outside', () => {
        const columnBet = 1;
        const stake = 100;
        const losingNumber = 2; // 2 is not in the first column
        const payout = calcColumns(columnBet, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('bet on correct column', () => {
        const columnBet = 1; // first column
        const stake = 100;
        const winningNumber = 1; // Number in the first column
        const payout = calcColumns(columnBet, stake, winningNumber);
        expect(payout).toBe(300);
    });
});

describe('calcDozens', () => {
    test('wins on first dozen bet', () => {
        const dozenBet = 4; 
        const stake = 100;
        const winningNumber = 11; // A number in the first dozen
        const payout = calcDozens(dozenBet, stake, winningNumber);
        expect(payout).toBe(300); // Expecting payout = stake * 3 
    });

    test('loses on first dozen bet when number is outside', () => {
        const dozenBet = 4; 
        const stake = 100;
        const losingNumber = 13; // A number not in the first dozen
        const payout = calcDozens(dozenBet, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('bet on correct dozen', () => {
        const dozenBet = 4; 
        const stake = 100;
        const winningNumber = 12; // Number in the first dozen
        const payout = calcDozens(dozenBet, stake, winningNumber);
        expect(payout).toBe(300);
    });

    test('wins on second dozen bet', () => {
        const dozenBet = 5; // Second dozen (13-24)
        const stake = 100;
        const winningNumber = 15;
        const payout = calcDozens(dozenBet, stake, winningNumber);
        expect(payout).toBe(300);
    });

    test('loses on second dozen bet when number is outside', () => {
        const dozenBet = 5; // Second dozen
        const stake = 100;
        const losingNumber = 25; // Number not in the second dozen
        const payout = calcDozens(dozenBet, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('wins on third dozen bet', () => {
        const dozenBet = 6; // Third dozen (25-36)
        const stake = 100;
        const winningNumber = 28;
        const payout = calcDozens(dozenBet, stake, winningNumber);
        expect(payout).toBe(300);
    });

    test('loses on third dozen bet when number is outside', () => {
        const dozenBet = 6; // Third dozen
        const stake = 100;
        const losingNumber = 1; // Number not in the third dozen
        const payout = calcDozens(dozenBet, stake, losingNumber);
        expect(payout).toBe(0);
    });

    // Edge Cases
    test('edge case win on first dozen upper limit', () => {
        const dozenBet = 4; // First dozen
        const stake = 100;
        const winningNumber = 12; // Upper limit of the first dozen
        const payout = calcDozens(dozenBet, stake, winningNumber);
        expect(payout).toBe(300);
    });

    test('edge case lose on first dozen going over', () => {
        const dozenBet = 4; // First dozen
        const stake = 100;
        const losingNumber = 13; // Just outside the first dozen
        const payout = calcDozens(dozenBet, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('edge case win on second dozen lower limit', () => {
        const dozenBet = 5; // Second dozen
        const stake = 100;
        const winningNumber = 13; // Lower limit of the second dozen
        const payout = calcDozens(dozenBet, stake, winningNumber);
        expect(payout).toBe(300);
    });

    test('edge case win on second dozen upper limit', () => {
        const dozenBet = 5; // Second dozen
        const stake = 100;
        const winningNumber = 24; // Upper limit of the second dozen
        const payout = calcDozens(dozenBet, stake, winningNumber);
        expect(payout).toBe(300);
    });

    test('edge case lose on second dozen going over', () => {
        const dozenBet = 5; // Second dozen
        const stake = 100;
        const losingNumber = 25; // Just outside the second dozen
        const payout = calcDozens(dozenBet, stake, losingNumber);
        expect(payout).toBe(0);
    });

    test('edge case win on third dozen lower limit', () => {
        const dozenBet = 6; // Third dozen
        const stake = 100;
        const winningNumber = 25; // Lower limit of the third dozen
        const payout = calcDozens(dozenBet, stake, winningNumber);
        expect(payout).toBe(300);
    });

    test('edge case win on third dozen upper limit', () => {
        const dozenBet = 6; // Third dozen
        const stake = 100;
        const winningNumber = 36; // Upper limit of the third dozen
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
      expect(payout).toBe(3600); // stake * 36
    });
  
    // Split bet
    const splitBet: bet = ["Split", 100, [17, 18]];
    test('correctly calculates payout for a Split bet', () => {
      const payout = calcPayout(splitBet, number);
      expect(payout).toBe(1800); // stake * 18
    });
  
    // Corner Bet
    const cornerBet: bet = ["Corner", 100, [1, 2, 4, 5]]; 
    test('correctly calculates payout for a Corner bet', () => {
    const payout = calcPayout(cornerBet, 4); // Winning number in the corner
    expect(payout).toBe(800); // stake * 8
    });

    // Double Street Bet
    const doubleStreetBet: bet = ["DoubleStreet", 100, [1, 4]]; 
    test('correctly calculates payout for a Double Street bet', () => {
    const payout = calcPayout(doubleStreetBet, 6); 
    expect(payout).toBe(600); // stake * 6
    });

    // Red/Black Bet
    const redBet: bet = [Color.Red, 100, []];
    test('correctly calculates payout for a Red bet', () => {
    const payout = calcPayout(redBet, 3); // 3 is a red number
    expect(payout).toBe(200); // stake * 2
    });

    // Red/Black Bet
    const blackBet: bet = [Color.Black, 100, []];
    test('correctly calculates payout for a Black bet', () => {
    const payout = calcPayout(blackBet, 3); 
    expect(payout).toBe(0); 
    });

    // Even/Odd Bet
    const evenBet: bet = [EvenOdd.Even, 100, []];
    test('correctly calculates payout for an Even bet', () => {
    const payout = calcPayout(evenBet, 4); // 4 is an even number
    expect(payout).toBe(200); // stake * 2
    });

    // Even/Odd Bet
    const oddBet: bet = [EvenOdd.Odd, 100, []];
    test('correctly calculates payout for an Odd bet', () => {
    const payout = calcPayout(oddBet, 4); // 4 is an even number
    expect(payout).toBe(0); // stake * 2
    });

    // Low/High Bet
    const lowBet: bet = [LowHigh.Low, 100, []];
    test('correctly calculates payout for a Low bet', () => {
    const payout = calcPayout(lowBet, 10); // 10 is a low number (1-18)
    expect(payout).toBe(200); // stake * 2
    });

    // Columns Bet
    const columnBet: bet = [1, 100, []]; // bet on the first column
    test('correctly calculates payout for a Columns bet', () => {
    const payout = calcPayout(columnBet, 1); // Winning number 
    expect(payout).toBe(300); // payout for a Columns bet is stake * 3
    });

    // Dozens Bet
    const dozenBet: bet = [4, 100, []]; 
    test('correctly calculates payout for a Dozens bet', () => {
    const payout = calcPayout(dozenBet, 12); // Winning number 
    expect(payout).toBe(300); // payout for a Dozens bet is stake * 3
    });

    // Example for an invalid bet type
    test('returns 0 for an invalid bet type', () => {
      const invalidBet: bet = ["InvalidType" as BetType, 100, [17]]; 
      const payout = calcPayout(invalidBet, number);
      expect(payout).toBe(0); 
    });
  });

describe('calculateWinnings', () => {
    const winningNumber = 17;
    
    test('calculates total winnings for a single bet', () => {
      const singleBet: bet = ["Single", 100, [17]];
      const bets: List<bet> = list(singleBet);
      const totalWinnings = calculateWinnings(bets, winningNumber);
      expect(totalWinnings).toBe(3600); // Single bet is stake * 36
    });
  
    test('calculates total winnings for multiple bets', () => {
      const betsList: List<bet> = list(
        ["Single", 100, [17]], // Winning bet
        [Color.Red, 100, []], // Losing bet, assuming 17 is not Red
        ["Split", 100, [16, 17]] // Winning bet
      );
      // 3600 for the Single, 0 for the Red (losing), and 1800 for the Split
      const totalWinnings = calculateWinnings(betsList, winningNumber);
      expect(totalWinnings).toBe(5400); //Total winnings from both winning bets
    });
  
    test('returns 0 for no bets', () => {
      const noBets: List<bet> = list();
      const totalWinnings = calculateWinnings(noBets, winningNumber);
      expect(totalWinnings).toBe(0); // Expecting 0 for no bets
    });
});

jest.mock('../../userInput/readUserInput', () => ({
    readUserInput: jest.fn(),
  }));
  
describe('numberBet', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('chooses zero successfully', async () => {
        const mockBet: bet = ['', 0, []];
        const expectedBet: bet = ["Single", 0, [0]];
        (readUserInput as jest.Mock).mockResolvedValueOnce('1');

        await numberBet(mockBet);

        expect(mockBet).toEqual(expectedBet);
    });

    test('chooses single number successfully', async () => {
        const mockBet: bet = ['', 0, []];
        const chosenNumber = 17;
        (readUserInput as jest.Mock)
                .mockResolvedValueOnce("2")
                .mockResolvedValueOnce(chosenNumber.toString());

        await numberBet(mockBet);

        expect(mockBet[0]).toBe("Single");
        expect(mockBet[2][0]).toBe(chosenNumber);
    });

    test('chooses split bet successfully', async () => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("3") // Choose split
            .mockResolvedValueOnce("11") // First number
            .mockResolvedValueOnce("1"); // Second number option

        await numberBet(mockBet);

        expect(mockBet[0]).toBe("Split");
    });

    test('chooses corner bet successfully', async () => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("5") // Choose corner
            .mockResolvedValueOnce("10") // First number for corner
            .mockResolvedValueOnce("1") // Option to go left or right
            .mockResolvedValueOnce("1"); // Option to go up or down

        await numberBet(mockBet);

        expect(mockBet[0]).toBe("Corner");
    });

    test('chooses street bet successfully', async () => {
        const mockBet: bet = ['', 0, []];
        const chosenStreet = 5; // Example street
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("4") // Choose street
            .mockResolvedValueOnce(chosenStreet.toString()); 
    
        await numberBet(mockBet);
    
        expect(mockBet[0]).toBe("Street");
        expect(mockBet[2][0]).toBe(chosenStreet);
    });
    
    test('chooses corner bet successfully', async () => {
        const mockBet: bet = ['', 0, []];
        const firstNumber = 10; // Example starting number for corner
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("5") // Choose corner
            .mockResolvedValueOnce(firstNumber.toString()) // First number
            .mockResolvedValueOnce("1") // Option to go right 
            .mockResolvedValueOnce("1"); // Option to go up 
    
        await numberBet(mockBet);
    
        expect(mockBet[0]).toBe("Corner");
    });
    
    test('chooses double street bet successfully', async () => {
        const mockBet: bet = ['', 0, []];
        const firstStreet = 3; // Example first street
        const secondStreet = 4; // Example second street, adjacent to first
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("6") // Choose double street
            .mockResolvedValueOnce(firstStreet.toString()) // First street
            .mockResolvedValueOnce("2"); // second street adjacent to the first
    
        await numberBet(mockBet);
    
        expect(mockBet[0]).toBe("DoubleStreet");
        // Ensure the streets chosen are as expected
        expect(mockBet[2]).toEqual(expect.arrayContaining([firstStreet, 
                                                           secondStreet]));
    });
    
    test('chooses split bet with specific adjacent number logic', async () => {
        const mockBet: bet = ['', 0, []];
        const firstNumber = 11; // Example number for split
        // Simulate choosing the first available adjacent number
        const secondNumberOption = "1"; 
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("3") // Choose split
            .mockResolvedValueOnce(firstNumber.toString()) // First number
            .mockResolvedValueOnce(secondNumberOption); // adjacent number
    
        await numberBet(mockBet);
    
        expect(mockBet[0]).toBe("Split");
    });

    test('chooses split bet with valid adjacent numbers', async () => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("3") // Split bet
            .mockResolvedValueOnce("11") // First number
            .mockResolvedValueOnce("1"); // selects a adjacent number

        await numberBet(mockBet);

        expect(mockBet[0]).toBe("Split");
        expect(mockBet[2].length).toBeGreaterThan(0); //numbers were added
    });

    test('chooses corner bet with specific position', async () => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("5") // Corner
            .mockResolvedValueOnce("10") // First number
            .mockResolvedValueOnce("1") // Direction choice
            .mockResolvedValueOnce("1"); // Position choice (up or down)

        await numberBet(mockBet);

        expect(mockBet[0]).toBe("Corner");
        expect(mockBet[2].length).toBe(4); // Corner bet involves 4 numbers
    });

    test('chooses double street bet with valid streets', async () => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("6") // Double street
            .mockResolvedValueOnce("3") // First street
            .mockResolvedValueOnce("1"); // Second street adjacent to the first

        await numberBet(mockBet);

        expect(mockBet[0]).toBe("DoubleStreet");
        expect(mockBet[2].length).toBe(2); // Double street involves 2 streets
    });

    test('chooses split bet with a number on the right edge', async () => {
        const mockBet: bet = ['', 0, []];
        const rightEdgeNumber = 3; // Example right edge number
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("3") // Choosing split bet
            .mockResolvedValueOnce(rightEdgeNumber.toString()) 
            .mockResolvedValueOnce("1"); 
    
        await numberBet(mockBet);
    
        expect(mockBet[0]).toBe("Split");
        // Verify the first number is the right edge number
        expect(mockBet[2][0]).toBe(rightEdgeNumber);
        // Verify the second number is a valid adjacent number 
    });
    
    test('split bet with a number on the right edge', async () => {
        const mockBet: bet = ['', 0, []];
        const rightEdgeNumber = 3; // Choosing a number on the right edge
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("3") // Choosing split bet
            .mockResolvedValueOnce(rightEdgeNumber.toString()) // First number
            .mockResolvedValueOnce("1"); // Choosing an adjacent number

        await numberBet(mockBet);

        expect(mockBet[0]).toBe("Split");
    });

    test('split bet with a middle number', async () => {
        const mockBet: bet = ['', 0, []];
        const middleNumber = 14; // Choosing a middle number
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("3") // Choosing split bet
            .mockResolvedValueOnce(middleNumber.toString()) //First number
            .mockResolvedValueOnce("1"); // Choosing an adjacent number

        await numberBet(mockBet);

        expect(mockBet[0]).toBe("Split");
    });

    test('corner bet with first number close to start, forcing right', 
         async () => {

        const mockBet: bet = ['', 0, []];
        const firstNumberCloseToStart = 2; // Example number close to start
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("5") // Choosing corner bet
            .mockResolvedValueOnce(firstNumberCloseToStart.toString());
    
        await numberBet(mockBet);
    
        //  The second number should be automatically chosen to the right
        expect(mockBet[0]).toBe("Corner");
        // Validates that second number is to the right
        expect(mockBet[2]).toContain(firstNumberCloseToStart + 3); 
    });
    
    test('corner bet with first number close to end, forcing left', 
         async () => {

        const mockBet: bet = ['', 0, []];
        const firstNumberCloseToEnd = 35; // Example number close to end
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("5") // Choosing corner bet
            .mockResolvedValueOnce(firstNumberCloseToEnd.toString());
    
        await numberBet(mockBet);
    
        // The second number should be automatically chosen to the left
        expect(mockBet[0]).toBe("Corner");
        // Validates that second number is to the left
        expect(mockBet[2]).toContain(firstNumberCloseToEnd - 3); 
    });
    
    test('split bet with a number on the left edge (Lowest)', async () => {
        const mockBet: bet = ['', 0, []];
        const leftEdgeNumber = 1; 
        const expectedAdjacentNumbers = [leftEdgeNumber + 1, 
                                         leftEdgeNumber + 3]; 
        
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("3") // Choosing split bet
            .mockResolvedValueOnce(leftEdgeNumber.toString()) //split bet
            .mockResolvedValueOnce("1"); // first adjacent number option
    
        await numberBet(mockBet);
    
        expect(mockBet[0]).toBe("Split");
        // Check that the adjacent number chosen is among the expected options
        expect(expectedAdjacentNumbers).toContain(mockBet[2][1]);
    });
});

describe('columnsAndDozensBet', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each([
        ["1", 1], // Column 1
        ["2", 2], // Column 2
        ["3", 3], // Column 3
    ])('chooses column %s successfully', async (userInput, expectedColumn) => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("1") // Choosing columns
            .mockResolvedValueOnce(userInput); // Choosing the specific column

        await columnsAndDozensBet(mockBet);

        expect(mockBet[0]).toBe(expectedColumn);
    });

    test.each([
        ["1", 4], // Dozen 1
        ["2", 5], // Dozen 2
        ["3", 6], // Dozen 3
    ])('chooses dozen %s successfully', async (userInput, expectedDozen) => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("2") // Choosing dozens
            .mockResolvedValueOnce(userInput); // Choosing the specific dozen

        await columnsAndDozensBet(mockBet);

        expect(mockBet[0]).toBe(expectedDozen);
    });
});

describe('evenBets', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('chooses Red successfully', async () => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("1") // Choosing red/black
            .mockResolvedValueOnce("1"); // Choosing red

        await evenBets(mockBet);

        expect(mockBet[0]).toBe(Color.Red);
    });

    test('chooses Black successfully', async () => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("1") // Choosing red/black
            .mockResolvedValueOnce("2"); // Choosing black

        await evenBets(mockBet);

        expect(mockBet[0]).toBe(Color.Black);
    });

    test('chooses Even successfully', async () => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("2") // Choosing even/odd
            .mockResolvedValueOnce("1"); // Choosing even

        await evenBets(mockBet);

        expect(mockBet[0]).toBe(EvenOdd.Even);
    });

    test('chooses Odd successfully', async () => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("2") // Choosing even/odd
            .mockResolvedValueOnce("2"); // Choosing odd

        await evenBets(mockBet);

        expect(mockBet[0]).toBe(EvenOdd.Odd);
    });

    test('chooses Low successfully', async () => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("3") // Choosing low/high
            .mockResolvedValueOnce("1"); // Choosing low

        await evenBets(mockBet);

        expect(mockBet[0]).toBe(LowHigh.Low);
    });

    test('chooses High successfully', async () => {
        const mockBet: bet = ['', 0, []];
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("3") // Choosing low/high
            .mockResolvedValueOnce("2"); // Choosing high

        await evenBets(mockBet);

        expect(mockBet[0]).toBe(LowHigh.High);
    });
});

describe('addBetAmount', () => {
    test('updates person balance and bet stake based on user input', 
         async () => {

        const mockBet: bet = ['', 0, []];
        const mockPerson: Person = { name: 'John Doe', 
                                     password : '1', 
                                     balance: 500, hand: [] };
        const mockStake = 100;
        (readUserInput as jest.Mock).mockResolvedValue(mockStake.toString());
  
        mockBet[1] = await addBetAmount(mockPerson);
  
        expect(mockBet[1]).toBe(mockStake);
        expect(mockPerson.balance).toBe(400); 
        let expectedString : string = "How much would you like to bet? \n"
        expect(readUserInput).toHaveBeenCalledWith(expectedString, 500);
    });
});

describe('buildABet', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('builds a numbers bet when user selects option 1', async () => {
        const stake = 100;
        (readUserInput as jest.Mock).mockResolvedValueOnce("1");

        const bet = await buildABet(stake);

        expect(bet[1]).toEqual(stake); // Verify stake is passed through 
    });

    test('builds an even bet when user selects option 2', async () => {
        const stake = 100;
        // Simulate user selecting "Even bets"
        (readUserInput as jest.Mock).mockResolvedValueOnce("2");

        const bet = await buildABet(stake);

        expect(bet[1]).toEqual(stake);
    });

    test('builds a columns or dozens bet when user selects option 3', 
         async () => {

        const stake = 100;
        // Simulate user selecting "Columns or dozens"
        (readUserInput as jest.Mock).mockResolvedValueOnce("3");

        const bet = await buildABet(stake);

        expect(bet[1]).toEqual(stake);
    });
});

describe('playerMove', () => {
    let person: Person;
    let allBets: List<bet>;

    beforeEach(() => {
        jest.clearAllMocks();
        person = createPerson('Test Player', '', 1000); 
        allBets = empty_list(); // Reset allBets to an empty state 
    });

    test('processes a bet then player choose to add antoher bet', async () => {
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("100") // Bet amount
            .mockResolvedValueOnce("1")
            .mockResolvedValueOnce("1") // Bet type, e.g., "Numbers bet"
            .mockResolvedValueOnce("1") // User chooses not to add another bet
            .mockResolvedValueOnce("100") // Bet amount
            .mockResolvedValueOnce("1")
            .mockResolvedValueOnce("1") // Bet type: "Numbers bet"
            .mockResolvedValueOnce("2");//Player chooses not to add another bet
    
        await playerMove(person, allBets);

        // Assuming the bet amount is subtracted from the initial balance
        expect(person.balance).toBeLessThanOrEqual(900); 
        expect(readUserInput).toHaveBeenCalledTimes(8);
        const expectedString : string = "Want to add a bet?: Yes(1) or No(2)\n"
        expect(readUserInput).toHaveBeenCalledWith(expectedString, 2);
    });
});

describe('startGame', () => {
    let person: Person;

    beforeEach(() => {
        jest.clearAllMocks();
        person = createPerson('Test Player', '', 1000);
    });

    test('two full games after one another', async () => {
        jest.mock('./roulette', () => ({
            spin: jest.fn().mockReturnValue(3)
        }));
        
        (readUserInput as jest.Mock)
            .mockResolvedValueOnce("100") // First bet amount
            .mockResolvedValueOnce("1") // numbersbet
            .mockResolvedValueOnce("1") // Single: 0
            .mockResolvedValueOnce("2") // Chooses to not add another bet
            .mockResolvedValueOnce("1") //Chooses to play again
            .mockResolvedValueOnce("100") // First bet amount
            .mockResolvedValueOnce("1") // numbersbet
            .mockResolvedValueOnce("1") // Single: 0
            .mockResolvedValueOnce("2") // Chooses to not add another bet
            .mockResolvedValueOnce("2") //chooses to not play again

        await startGame(person);

        expect(person.balance).toBe(800); //bet amount is subtracted two times
        expect(readUserInput).toHaveBeenCalledTimes(10); // Ensure loop exits 
    });
});


