import { isValidPassword } from './Password';

describe('isValidPassword', () => {
  test.each([
    ['Password@123', true], // Valid: meets all criteria
    ['password@123', false], // Invalid: no uppercase letter
    ['PASSWORD123', false], // Invalid: no special character
    ['Pass@1', false], // Invalid: not long enough
    ['Passw@rd', true], // Valid: meets all criteria
    ['PASSWORD@', true], // Valid: meets all criteria
    ['password@', false], // Invalid: no uppercase letter
    ['PASSWORD!', true], // Valid: meets all criteria
    ['passW@rd', true], // Valid: meets all criteria
    ['12345678', false], // Invalid: no uppercase letter or special character
    ['!@#$%^&*', false], // Invalid: no uppercase letter
    ['Abcdefgh', false], // Invalid: no special character
  ])('"%s" should be %s', (password, expected) => {
    expect(isValidPassword(password)).toBe(expected);
  });
});
