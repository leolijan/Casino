import { readUserInput, readUserInputBasic } from "../userInput/readUserInput";
import { AllUsers } from "../../Menu/login";
import { insertMoney } from "./InsertMoney";


jest.mock("../userInput/readUserInput", () => ({
    readUserInput: jest.fn(),
    readUserInputBasic: jest.fn()
  }));
  
  describe('insert_money', () => {
    let allUsers: AllUsers;
    beforeEach(() => {
      jest.clearAllMocks();
      allUsers = {
        testUser: { balance: 1000, 
                    name: 'Test User', 
                    password: 'test', 
                    hand: [] }
      };
    });
  
    test('successfully inserts predefined money amount', async () => {
      jest.mocked(readUserInput).mockResolvedValue('1'); 

      await insertMoney('testUser', allUsers);
      expect(allUsers.testUser.balance).toBe(1100);
    });
  
    test('inserts custom money amount successfully', async () => {
      jest.mocked(readUserInput).mockResolvedValue('5'); 
      jest.mocked(readUserInputBasic).mockResolvedValue('250'); 
  
      await insertMoney('testUser', allUsers);
  
      expect(allUsers.testUser.balance).toBe(1250);//Check if money is added
    });
    
    test('handles invalid custom amount', async () => {
      jest.mocked(readUserInput).mockResolvedValue('5'); 
      jest.mocked(readUserInputBasic).mockResolvedValue('-100'); 

      await insertMoney('testUser', allUsers);
      expect(allUsers.testUser.balance).toBe(1000);//should remain unchanged
    });
    
    test('exits without inserting money', async () => {
      jest.mocked(readUserInput).mockResolvedValue('6');//Choosing to exit

      await insertMoney('testUser', allUsers);
      expect(allUsers.testUser.balance).toBe(1000);
    });
    
    test('handles selecting an invalid option', async () => {
      jest.mocked(readUserInput).mockResolvedValue('7'); 
      
      await insertMoney('testUser', allUsers);
      expect(allUsers.testUser.balance).toBe(1000); 
    });
  });
  