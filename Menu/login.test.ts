// Menu.test.ts
import * as fs from 'fs';
import { write_login_credentials, read_login_credentials, read_user_input, new_user} from './login';

jest.mock('fs');

// Adjusted test for write_login_credentials to match the JSON structure
describe('write_login_credentials', () => {
    it('writes user credentials to a file', () => {
      const mockUsers = {
        "1": { name: "1", password: "1", balance: 1000, hand: [] },
        "2": { name: "2", password: "2", balance: 1000, hand: [] },
        "a": { name: "a", password: "a", balance: 1000, hand: [] }
      };
      const jsonString = JSON.stringify(mockUsers, null, 2);
      
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      
      write_login_credentials('user_information.json', mockUsers);
      
      expect(fs.writeFileSync).toHaveBeenCalledWith('user_information.json', jsonString);
    });
  });
// Adjusted test for read_login_credentials to match the JSON structure
describe('read_login_credentials', () => {
    it('reads user credentials from a file', () => {
      const mockUsers = {
        "1": { name: "1", password: "1", balance: 1000, hand: [] },
        "2": { name: "2", password: "2", balance: 1000, hand: [] },
        "a": { name: "a", password: "a", balance: 1000, hand: [] }
      };
      const jsonString = JSON.stringify(mockUsers);
      
      jest.spyOn(fs, 'readFileSync').mockReturnValue(jsonString);
      
      const users = read_login_credentials('user_information.json');
      
      expect(users).toEqual(mockUsers);
      expect(fs.readFileSync).toHaveBeenCalledWith('user_information.json', 'utf8');
    });
  });

 
  
  
  