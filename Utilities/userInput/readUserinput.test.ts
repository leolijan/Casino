import { readUserInput, readUserInputBasic, check } from './readUserInput';

const mockQuestion = jest.fn();
const mockClose = jest.fn();

jest.mock('readline', () => ({
  createInterface: () => ({
    question: mockQuestion,
    close: mockClose,
  }),
}));

jest.mock('process', () => ({
  ...jest.requireActual('process'),
  exit: jest.fn(),
}));

describe('readUserInputBasic', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockQuestion.mockImplementation((prompt, cb) => cb('user input'));
    });

    test('should return user input', async () => {
      const input = await readUserInputBasic("Username: ");
      expect(input).toBe('user input');
    });
});

describe('readUserInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // First simulate invalid input, then valid input.
    mockQuestion.mockImplementationOnce((prompt, callback) => callback('4')) 
                .mockImplementationOnce((prompt, callback) => callback('1'));
  });

  test('should eventually return valid input after invalid input', async () => {
    const menu_options: { [key: string]: string } = {
        "1": "Login",
        "2": "Register",
        "3": "Quit"
      };
    const input = await readUserInput('Choose an option: ', 
                                      Object.keys(menu_options).length);
    expect(input).toBe('1');
  });

  test('should log "WRONG INPUT" for invalid inputs', async () => {
    mockQuestion.mockImplementationOnce((prompt, callback) => {
      callback('invalid'); // Simulate an answer that would fail the check
    }).mockImplementationOnce((prompt, callback) => {
      callback('1'); // Provide a valid input to allow the promise to resolve
    });

    // Spy on console.log to verify that "WRONG INPUT" is logged
    const consoleSpy = jest.spyOn(console, 'log');

    await readUserInput('Enter a choice: ', 3);

    // Verify "WRONG INPUT" was logged
    expect(consoleSpy).toHaveBeenCalledWith("WRONG INPUT");

    consoleSpy.mockRestore();
  });
});

describe('check', () => {
    const max = 3; 
  
    test.each([1, 2, 3])('should return true for valid inputs within range', 
                         (input) => {
                                      expect(check(input.toString(), 
                                                   max)).toBe(true);
    });
  
    test.each([0, 4, -1, 100])('should return false', 
                               (input) => {
                                           expect(check(input.toString(), 
                                                        max)).toBe(false);
    });
  
    test.each(['a', '', ' ', 'one'])('should return false for non-numeric inputs', (input) => {
      expect(check(input, max)).toBe(false);
    });
  
    test('should return true for the lowest boundary value', () => {
      expect(check('1', max)).toBe(true);
    });
  
    test('should return true for the highest boundary value', () => {
      expect(check(max.toString(), max)).toBe(true);
    });
  
    test('should return false for values just outside the boundary', () => {
      expect(check('0', max)).toBe(false);
      expect(check((max + 1).toString(), max)).toBe(false);
    });
  });

