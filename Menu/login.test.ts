import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { loadUserData, saveUserData, newUser, AllUsers} from './login';
import { readUserInputBasic } from '../Utilities/userInput/readUserInput';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  // Mock compare as always resolving to true
  compare: jest.fn().mockImplementation((inputPassword, 
                                         storedPassword) => Promise.
                                                                 resolve(true)),
  // Mock hash to return 'hashed_password'
  hash: jest.fn().mockImplementation((password, 
                                      saltRounds) => Promise.
                                                     resolve('hashed_password')) 
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
    expect(bcrypt.hash).toHaveBeenCalledWith('Valid$Password1', 
                                            expect.any(Number));
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
    expect(bcrypt.hash).toHaveBeenCalledWith('Valid$Password3', 
                                             expect.any(Number));
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
    expect(allUsers['Test User']).toEqual({ name: 'Test User', 
                                            password: 'test', 
                                            balance: 1000, 
                                            hand: [] });
  });

  test('should handle file read errors gracefully', () => {
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File read error');
    });

    const allUsers: AllUsers = {};
    expect(() => loadUserData('../user_information.json', 
                              allUsers)).not.toThrow();
    expect(Object.keys(allUsers)).toHaveLength(0); 
  });
});

describe('saveUserData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should save user data to a file', () => {
    const allUsers: AllUsers = {
      'testUser': { name: 'Test User', 
                    password: 'test', 
                    balance: 1000, 
                    hand: [] }
    };

    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    saveUserData('../user_information.json', allUsers);

    expect(fs.writeFileSync).toHaveBeenCalledWith('../user_information.json', 
                                                  JSON.stringify(allUsers, 
                                                                 null, 
                                                                 2));
  });

  test('should handle file write errors gracefully', () => {
    const allUsers: AllUsers = {
      'testUser': { name: 'Test User', 
                    password: 'test', 
                    balance: 1000, 
                    hand: [] }
    };

    (fs.writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File write error');
    });

    expect(() => saveUserData('../user_information.json', 
                              allUsers)).not.toThrow();
  });
});