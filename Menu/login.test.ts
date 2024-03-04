import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { loadUserData, saveUserData, login, newUser, AllUsers, loggedIn, menu} from './login';
import {readUserInput, readUserInputBasic} from '../Utilities/userInput/readUserInput';
import { Person, createPerson } from '../Utilities/Player/Player';
import { startGame as startBlackjack } from '../Games/Card Games/Blackjack/Blackjack';
import { startGame as startBaccarat } from '../Games/Card Games/Baccarat/Baccarat';
import { startGame as startRoulette } from '../Games/Roulette/roulette';


jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockImplementation((inputPassword, storedPassword) => Promise.resolve(true)), // Mock compare as always resolving to true
  hash: jest.fn().mockImplementation((password, saltRounds) => Promise.resolve('hashed_password')) // Mock hash to return 'hashed_password'
}));

jest.mock('../Utilities/userInput/readUserInput', () => ({
  readUserInput: jest.fn(),
  readUserInputBasic: jest.fn()
}));

describe('newUser', () => {
  let allUsers : AllUsers= {};

  beforeEach(() => {
    allUsers = {}; // Reset allUsers before each test
    jest.clearAllMocks(); 
  });

  test('successful user registration', async () => {
    jest.mocked(readUserInputBasic)
      .mockResolvedValueOnce('newUsername') 
      .mockResolvedValueOnce('Valid$Password1') 
      .mockResolvedValueOnce('Valid$Password1'); 

    await newUser(allUsers);

    expect(allUsers).toHaveProperty('newUsername');
    expect(bcrypt.hash).toHaveBeenCalledWith('Valid$Password1', expect.any(Number));
  });

  test('non-matching password and confirmation', async () => {
    jest.mocked(readUserInputBasic)
      .mockResolvedValueOnce('anotherNewUsername') // Mock username input
      .mockResolvedValueOnce('Valid$Password3') // Mock password input
      .mockResolvedValueOnce('DifferentPassword') // Non-matching 
      .mockResolvedValueOnce('anotherNewUsername')
      .mockResolvedValueOnce('Valid$Password3') // Retry with the same password
      .mockResolvedValueOnce('Valid$Password3'); // Confirm the valid password
  
    await newUser(allUsers);
  
    expect(allUsers).toHaveProperty('anotherNewUsername');
    expect(bcrypt.hash).toHaveBeenCalledWith('Valid$Password3', expect.any(Number));
  });

  test('username already exists', async () => {
    allUsers['existingUsername'] = { balance: 1000, 
                                     name: 'Existing User', 
                                     password: 'hashed', 
                                     hand: [] };
  
    jest.mocked(readUserInputBasic)
      .mockResolvedValueOnce('existingUsername')
      .mockResolvedValueOnce('Valid$Password4') 
      .mockResolvedValueOnce('Valid$Password4')
      .mockResolvedValueOnce('newValidUsername') 
      .mockResolvedValueOnce('Valid$Password4') 
      .mockResolvedValueOnce('Valid$Password4'); 
  
    await newUser(allUsers);
  
    expect(allUsers).toHaveProperty('newValidUsername');
    expect(bcrypt.hash).toHaveBeenCalledWith('Valid$Password4', 
                                             expect.any(Number));
  });

  test('password does not meet criteria', async () => {
    jest.mocked(readUserInputBasic)
      .mockResolvedValueOnce('uniqueUsername') // Mock username input
      .mockResolvedValueOnce('short') // Invalid password attempt
      .mockResolvedValueOnce('short') // invalid password
      .mockResolvedValueOnce('uniqueUsername') // Mock username input
      .mockResolvedValueOnce('Valid$Password2') // Second attempt 
      .mockResolvedValueOnce('Valid$Password2'); // Confirm the valid password
  
    await newUser(allUsers);
  
    expect(allUsers).toHaveProperty('uniqueUsername');
    expect(bcrypt.hash).toHaveBeenCalledWith('Valid$Password2', 
                                             expect.any(Number));
  });
});

describe('loadUserData', () => {
  test('should load user data into allUsers object', () => {
    const mockJsonData = JSON.stringify({
      'Test User': { name: 'Test User', 
                     password: 'test', 
                     balance: 1000, 
                     hand: [] }
    });
    (fs.readFileSync as jest.Mock).mockReturnValue(mockJsonData);
    
    const allUsers: AllUsers = {};
    loadUserData('../user_information.json', allUsers);
    
    expect(allUsers).toHaveProperty('Test User');
    expect(allUsers['Test User']).toEqual({ name: 'Test User', password: 'test', balance: 1000, hand: [] });
  });

  test('should handle file read errors gracefully', () => {
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File read error');
    });

    const allUsers: AllUsers = {};
    expect(() => loadUserData('../user_information.json', allUsers)).not.toThrow();
    expect(Object.keys(allUsers)).toHaveLength(0); // Expecting an empty object if there's an error
  });
});

describe('saveUserData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should save user data to a file', () => {
    const allUsers: AllUsers = {
      'testUser': { name: 'Test User', password: 'test', balance: 1000, hand: [] }
    };

    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    saveUserData('../user_information.json', allUsers);

    expect(fs.writeFileSync).toHaveBeenCalledWith('../user_information.json', JSON.stringify(allUsers, null, 2));
  });

  test('should handle file write errors gracefully', () => {
    const allUsers: AllUsers = {
      'testUser': { name: 'Test User', password: 'test', balance: 1000, hand: [] }
    };

    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File write error');
    });

    expect(() => saveUserData('../user_information.json', allUsers)).not.toThrow();
  });
});

jest.mock('../Games/Card Games/Blackjack/Blackjack', () => ({
  startGame: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../Games/Card Games/Baccarat/Baccarat', () => ({
  startGame: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../Games/Roulette/roulette', () => ({
  startGame: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('./login', () => ({
  ...jest.requireActual('./login'), // This line preserves other functions unmocked
  loggedIn: jest.fn(),
  menu: jest.fn(),
}));

// describe('loggedIn', () => {
//   let allUsers: AllUsers;

//   beforeEach(() => {
//     // Reset all mocks
//     jest.clearAllMocks();
//     // Setup a mock user
//     allUsers = {
//       'testUser': createPerson('Test User', 'testPassword', 1000)
//     };
//   });

//   test('calls startBlackjack when option 1 is chosen', async () => {
//     (readUserInput as jest.Mock).mockResolvedValue('1')
                            
                                
//     await loggedIn('testUser', allUsers);
//     expect(startBlackjack as jest.Mock).toHaveBeenCalledWith(allUsers['testUser']);
//   });

//   test('calls startBaccarat when option 2 is chosen', async () => {
//     (readUserInput as jest.Mock).mockResolvedValue('2')
                               
//     await loggedIn('testUser', allUsers);
//     expect(startBaccarat as jest.Mock).toHaveBeenCalledWith(allUsers['testUser']);
//   });

//   test('calls startRoulette when option 3 is chosen', async () => {
//     (readUserInput as jest.Mock).mockResolvedValue('3')
                                

//     await loggedIn('testUser', allUsers);
//     expect(startRoulette as jest.Mock).toHaveBeenCalledWith(allUsers['testUser']);
//   });

//   // Add more tests for other options, including "Add Money" and "Log Out"
// });

// describe('login', () => {
//   let allUsers: AllUsers;

//   beforeEach(() => {
//     // Reset mocks and set default behavior
//     jest.clearAllMocks();
//     (bcrypt.compare as jest.Mock).mockReset();
    
//     // Initialize with a test user
//     allUsers = {
//       'testUser': {
//         name: 'Test User',
//         password: '$2b$10$testHashedPassword', // Simulated bcrypt hash
//         balance: 1000,
//         hand: [],
//       },
//     };
//   });


//   test('successfully logs in with correct credentials', async () => {
//     const allUsers: AllUsers = {
//       'testUser': {
//         name: 'Test User',
//         password: 'hashedPassword',
//         balance: 1000,
//         hand: [],
//       },
//     };
  
//     (readUserInputBasic as jest.Mock)
//       .mockResolvedValueOnce('testUser')
//       .mockResolvedValueOnce('correctPassword');
  
//     (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  
//     await login(allUsers);
  
//     expect(loggedIn as jest.Mock).toHaveBeenCalledWith('testUser', allUsers);
//   });
  

//   test('fails to log in with incorrect credentials', async () => {
//     const allUsers: AllUsers = {
//       'testUser': {
//         name: 'Test User',
//         password: 'hashedPassword',
//         balance: 1000,
//         hand: [],
//       },
//     };
  
//     (readUserInputBasic as jest.Mock)
//       .mockResolvedValueOnce('testUser')
//       .mockResolvedValueOnce('wrongPassword');
  
//     (bcrypt.compare as jest.Mock).mockResolvedValue(false);
  
//     await login(allUsers);
  
//     // Since loggedIn should not be called, we can check that it wasn't
//     expect(loggedIn as jest.Mock).not.toHaveBeenCalled();
//   });

//   test('exceeds maximum login attempts', async () => {
//     (readUserInputBasic as jest.Mock)
//       .mockResolvedValueOnce('testUser')
//       .mockResolvedValueOnce('wrongPassword') // First attempt
//       .mockResolvedValueOnce('testUser')
//       .mockResolvedValueOnce('wrongPassword') // Second attempt
//       .mockResolvedValueOnce('testUser')
//       .mockResolvedValueOnce('wrongPassword'); // Third attempt
  
//     (bcrypt.compare as jest.Mock).mockResolvedValue(false);
  
//     await login({});
  
//     // Check that menu is eventually called after maximum attempts are reached
//     expect(menu as jest.Mock).toHaveBeenCalled();
//   });
  
// });

