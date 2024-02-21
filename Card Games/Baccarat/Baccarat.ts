import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { createBlackjackDeck, Card, ensureDeckNotEmpty} from '../Deck/Deck'; // Assuming this can create a suitable deck
import { Person, createPerson } from '../../Player/Player'; // Assuming this can create a person with a balance and hand

const rl = createInterface({ input, output });

async function dealCards(deck: Card[], person: Person, cardCount: number = 2): Promise<void> {
    ensureDeckNotEmpty(deck);
    for (let i = 0; i < cardCount; i++) {
        person.hand.push(deck.pop()!);
    }
}

function calculateHandValue(hand: Card[]): number {
    let total = hand.reduce((acc, card) => {
        if (card.value >= 10) return acc; // 10, J, Q, K are worth 0 points
        if (card.value === 14) return acc + 1; // Aces are worth 1 point
        return acc + card.value; // Other cards are face value
    }, 0);

    return total % 10;
}

function isPair(hand: Card[]): boolean {
    if (hand.length !== 2) return false;
    return hand[0].value === hand[1].value;
}

async function getBets(player: Person): Promise<{ betAmount: number; betType: string }> {
    let betAmount = 0;
    let betType = '';
    
    // Prompt for bet type
    while (true) {
        console.log("Please choose the type of bet:");
        console.log("1: Player wins");
        console.log("2: Banker wins");
        console.log("3: Tie");
        console.log("4: Player pair");
        console.log("5: Banker pair");
        const betTypeString = await rl.question("Enter the number for your bet type: ");
        
        switch (betTypeString.trim()) {
            case '1':
                betType = 'player';
                break;
            case '2':
                betType = 'banker';
                break;
            case '3':
                betType = 'tie';
                break;
            case '4':
                betType = 'player pair';
                break;
            case '5':
                betType = 'banker pair';
                break;
            default:
                console.log("Invalid selection. Please enter a number from 1 to 5.");
                continue;
        }
        break; // Valid bet type selected
    }

    // Prompt for bet amount
    while (true) {
        const betAmountString = await rl.question(`You have $${player.balance}. How much would you like to bet? `);
        betAmount = parseInt(betAmountString, 10);
        if (!isNaN(betAmount) && betAmount > 0 && betAmount <= player.balance) {
            break; // Valid bet amount
        } else {
            console.log(`Invalid amount. Please enter a number between 1 and $${player.balance}.`);
        }
    }


    return { betAmount, betType };
}

async function decideOutcome(playerValue: number, bankerValue: number, playerHand: Card[], bankerHand: Card[], betType: string): Promise<{ outcome: string; winnings: number }> {
    let outcome = '';
    let winnings = 0;

    switch (betType) {
        case 'player':
            if (playerValue > bankerValue) {
                outcome = 'Win';
                winnings = 2;
            } else {
                outcome = 'Lose';
            }
            break;
        case 'banker':
            if (bankerValue > playerValue) {
                outcome = 'Win';
                winnings = 1.95; // 5% commission
            } else {
                outcome = 'Lose';
            }
            break;
        case 'tie':
            if (playerValue === bankerValue) {
                outcome = 'Win';
                winnings = 8;
            } else {
                outcome = 'Lose';
            }
            break;
        case 'player pair':
            if (isPair(playerHand)) {
                outcome = 'Win';
                winnings = 11;
            } else {
                outcome = 'Lose';
            }
            break;
        case 'banker pair':
            if (isPair(bankerHand)) {
                outcome = 'Win';
                winnings = 11;
            } else {
                outcome = 'Lose';
            }
            break;
        default:
            outcome = 'Lose';
            break;
    }

    return { outcome, winnings };
}

export async function startGame(player: Person) {
    try {
        let playAgain = 'y';

        while (playAgain.toLowerCase() === 'y') {
            player.hand = [];
            const deck = createBlackjackDeck();
            const banker: Person = createPerson('Banker', '', 0);
            banker.hand = [];

            const { betAmount, betType } = await getBets(player);

            await dealCards(deck, player);
            await dealCards(deck, banker);

            console.log('Welcome to Baccarat!');

            const playerValue = calculateHandValue(player.hand);
            const bankerValue = calculateHandValue(banker.hand);

            console.log(`Player's hand: ${player.hand.map(card => `${card.value} of ${card.suit}`).join(', ')} (${playerValue})`);
            console.log(`Banker's hand: ${banker.hand.map(card => `${card.value} of ${card.suit}`).join(', ')} (${bankerValue})`);

            const { outcome, winnings } = await decideOutcome(playerValue, bankerValue, player.hand, banker.hand, betType);

            if (outcome === 'Win') {
                console.log(`You win! Bet Type: ${betType}`);
                player.balance += betAmount * winnings;
            } else {
                console.log(`You lose! Bet Type: ${betType}`);
                player.balance -= betAmount;
            }

            console.log(`Your new balance is $${player.balance}.`);

            if (player.balance <= 0) {
                console.log("You've run out of funds! Game over.");
                break;
            }

            playAgain = await rl.question("Would you like to play again? (y/n): ");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        console.log("Thank you for playing!");
        await rl.close();
    }
}

startGame(createPerson('Player', '', 1000));
