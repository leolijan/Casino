import { createPerson } from './Player';


test('createPerson creates a person with correct name, password, and balance', 
     () => {
  const name = 'John Doe';
  const password = 'password123';
  const balance = 1000;

  const person = createPerson(name, password, balance);

  expect(person.name).toBe(name);
  expect(person.password).toBe(password);
  expect(person.balance).toBe(balance);
});