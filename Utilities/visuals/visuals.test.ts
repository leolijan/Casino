import { splashScreen, printOptions, printEmptyLines} from './visuals';

describe('splashScreen', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  test('should print the splash screen to the console', () => {
    splashScreen();
    expect(console.log).toHaveBeenCalled();
  });
});

describe('printOptions', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  test('should print all options to the console', () => {
    const options = {
      '1': 'Option One',
      '2': 'Option Two',
      '3': 'Option Three',
    };

    printOptions(options);

    // Verify console.log was called the correct number of times
    expect(console.log).toHaveBeenCalledTimes(Object.keys(options).length);

    // Verify console.log was called with correct strings for each option
    Object.entries(options).forEach(([key, value]) => {
      expect(console.log).toHaveBeenCalledWith(`${key}) ${value}`);
    });
  });
});

describe('printEmptyLines', () => {
  test('prints the correct number of empty lines', () => {
    const count = 3;
    console.log = jest.fn(); // Mock console.log

    printEmptyLines(count);

    expect(console.log).toHaveBeenCalledTimes(count); 
  });
});