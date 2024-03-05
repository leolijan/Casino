import { isValidPassword } from './Password';

describe('isValidPassword', () => {
  test.each([
    ['Password@123', true],
    ['password@123', false], 
    ['PASSWORD123', false], 
    ['Pass@1', false], 
    ['Passw@rd', true], 
    ['PASSWORD@', true], 
    ['password@', false], 
    ['PASSWORD!', true], 
    ['passW@rd', true], 
    ['12345678', false], 
    ['!@#$%^&*', false], 
    ['Abcdefgh', false], 
  ])('"%s" should be %s', (password, expected) => {
    expect(isValidPassword(password)).toBe(expected);
  });
});
