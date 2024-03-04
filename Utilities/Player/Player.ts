import { Card } from "../../Games/Card Games/Deck/Deck"

export type Person = {
    name: string,
    password: string, 
    balance: number,
    hand : Array<Card>,
  }
  
/**
 * Constructs a new person object with specified name, password, and initial balance.
 *
 * @example
 * const person = createPerson('John Doe', 'password123', 1000);
 * // person is { name: 'John Doe', password: 'password123', balance: 1000, hand: [] }
 *
 * @param name The name of the person.
 * @param password The password for the person's account.
 * @param balance The initial balance for the person's account.
 * @returns Returns a new person object with the provided details and an empty hand.
 */
export function createPerson(name: string, 
                             password: string, 
                             balance: number): Person {
    return {
        name,
        password,
        balance,
        hand : [],
    };
} 


           