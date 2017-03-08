Hello! This is a CLI program. I used Node.js to build it. Once you have cloned or forked the repository, navigate to it in the terminal and NPM install. Afterwards, you can either enter "npm start" or "nodemon" to start the program.

The commands are:

add

take

change

show

q

add:
  To use add, just enter "add" and the amounts you wish to add in corresponding bill amounts (similar to the examples in the coding challenge).

take:
  To use take, just enter "take" and the amounts you wish to take in corresponding bill amounts (similar to the examples in the coding challenge).

change:
  To use change, just enter "change" and the amount you wish to change (similar to the examples in the coding challenge).

show:
  To use show, just enter "show" and it will give you the register total and corresponding bill amounts (similar to the coding challenge).

q:
  to quit the program, just enter "q" and you will quit the program.


Other notes:
  I used the vorpal library to build the CLI interface. While I was building I ran into a bug in the library in which variadic arguments that start with 0 cause an error. I made a simple work around in this challenge to deal with the issue and submitted an issue in GitHub to the library.
