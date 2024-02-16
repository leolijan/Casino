import { Card } from "../Card Games/Deck/Deck"

export type Person = {
    name: string,
    password: string, 
    balance: number,
    hand : Card[],

  }
  
 /**
 * Creates a new person object with provided details.
 * @param {string} name - The name of the person.
 * @param {string} password - The password for the person's account.
 * @param {number} balance - The initial balance for the person.
 * @returns {Person} Returns a new person object.
 */
export function createPerson(name: string, password: string, balance: number): Person {
    return {
        name,
        password,
        balance,
        hand : [],

    };
} 


           