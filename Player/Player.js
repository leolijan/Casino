"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPerson = void 0;
/**
* Creates a new person object with provided details.
* @param {string} name - The name of the person.
* @param {string} password - The password for the person's account.
* @param {number} balance - The initial balance for the person.
* @returns {Person} Returns a new person object.
*/
function createPerson(name, password, balance) {
    return {
        name: name,
        password: password,
        balance: balance,
        hand: [],
    };
}
exports.createPerson = createPerson;
