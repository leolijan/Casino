# Casino
There are several files used for the casino program. There are four major 
coding files called "login.ts", "blackjack.ts", "baccarat.ts", and "roulette.ts".
Different utility files are used for all of these four major files mentioned. 
In addition, built-in modules such as "fs" and "readline" are also used to 
handle flat files and user input. 

# Installation of bcrypt
Write in the terminal "npm install bcrypt" then write 
"npm install @types/bcrypt --save-dev". If you still have problems running the program, write "npm  uninstall bcrypt" and then "npm install bcrypt".

# Startup
To start the casino program all of the TypeScript files needs to be compiled
to Javascript. This can be done by using the tool Node.js. Then use the
TypeScript compiler "tsc" to compile the TypeScript files. 
The file where the the program is started is called login.ts, found in the "Menu" folder.

# Tests
There are test cases to every code file that is used within the program. These
test files can be run using the test format Jest. Before running with Jest
the framework first has to be installed. After Jest is installed, write "jest" 
in the code root directory to run all the test cases. 
