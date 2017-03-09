#!/usr/bin/env node
'use strict';

const program = require('vorpal')();
const chalk = require('chalk');


let cashRegister = {
  20: 0,
  10: 0,
  5 : 0,
  2 : 0,
  1 : 0
};


//Prints cash register and returns total amount in register
const showReg = () => {

  let totalReg = 0;

  for (const billAmount in cashRegister) {
    totalReg += (Number(billAmount) * cashRegister[billAmount]);
  }

  console.log(chalk.yellow('Current Cash Register:') + ' ' + chalk.red('$') + chalk.red(totalReg) + ' ' + chalk.red(cashRegister[20]) + chalk.red('x20') + ' ' + chalk.red(cashRegister[10]) + chalk.red('x10') + ' ' + chalk.red(cashRegister[5]) + chalk.red('x5') + ' ' + chalk.red(cashRegister[2]) + chalk.red('x2') + ' ' + chalk.red(cashRegister[1]) + chalk.red('x1'));

  return totalReg;
};

//returns an array of possible bills to deduct for change
const changeBills = (amount, arr) => {
  if (amount < 0) {
    return false;
  }
  if (amount === 0) { return []; }

  arr = arr.slice();
  while (arr.length) {
    const value = arr.shift();
    const possSolution = changeBills(amount - value, arr);
    if (possSolution) {
      return possSolution.concat(value);
    }
  }
};


//totalBills creates an object based on the arguments for add or take and returns that object.
const totalBills = (arr, str) => {
  const typeStr = str;
  let totalAmount = 0;
  const totalBillsObj = {
    20: 0,
    10: 0,
    5 : 0,
    2 : 0,
    1 : 0
  };

  let counter = 0;

  arr.forEach((numOfBills, index) => {
    switch (counter) {
    case 0:
      totalBillsObj[20] += Number(numOfBills);
      totalAmount += 20 * Number(numOfBills);
      counter += 1;
      break;
    case 1:
      totalBillsObj[10] += Number(numOfBills);
      totalAmount += 10 * Number(numOfBills);
      counter += 1;
      break;
    case 2:
      totalBillsObj[5] += Number(numOfBills);
      totalAmount += 5 * Number(numOfBills);
      counter += 1;
      break;
    case 3:
      totalBillsObj[2] += Number(numOfBills);
      totalAmount += 2 * Number(numOfBills);
      counter += 1;
      break;
    case 4:
      totalBillsObj[1] += Number(numOfBills);
      totalAmount += 1 * Number(numOfBills);
      counter = 0;
      break;
    }
  });

  //prints the amount that is added or taken
  console.log(chalk.magenta('Total') + ' ' + chalk.magenta(typeStr) + chalk.magenta(': ') + chalk.cyan('$') + chalk.cyan(totalAmount) + ' ' + chalk.cyan(totalBillsObj[20]) + chalk.cyan('x20') + ' ' + chalk.cyan(totalBillsObj[10]) + chalk.cyan('x10') + ' ' + chalk.cyan(totalBillsObj[5]) + chalk.cyan('x5') + ' ' + chalk.cyan(totalBillsObj[2]) + chalk.cyan('x2') + ' ' + chalk.cyan(totalBillsObj[1]) + chalk.cyan('x1'));

  return totalBillsObj;
};


//Add bills command
let addArgs; //found a bug in the Vorpal Library (and opened an issue) that will not allow variadic arguments that start with 0, the "addArgs" variable is an ugly, but quick workaround;
program
  .command('add [bills...]')
  .description('run add bills to register')
  .parse(function(command, args) {
    addArgs = args.split(' ');
    return command;
  })
  .action(function(args, cb) {
    const addBillsObj = totalBills(addArgs, 'Added');

    for (const bill in addBillsObj) {
      cashRegister[bill] += addBillsObj[bill];
    }
    showReg();
    cb();
  });

// Take bills command
let takeArgs; //found a bug in the Vorpal Library (and opened an issue) that will not allow variadic arguments that start with 0, the "takeArgs" is an ugly, but quick workaround;
program
  .command('take [bills...]')
  .description('run take bills from register')
  .parse(function(command, args) {
    takeArgs = args.split(' ');
    return command;
  })
  .action(function(args, cb) {
    const oldCashRegister = Object.assign({}, cashRegister);
    const removeBillsObj = totalBills(takeArgs, 'Taken');

    for (const bill in removeBillsObj) {
      if (cashRegister[bill] >= removeBillsObj[bill]) {
        cashRegister[bill] -= removeBillsObj[bill];
      } else {
        console.log('Sorry! Not Enough Cash');
        cashRegister = Object.assign({}, oldCashRegister);
      }
    }

    showReg();
    cb();
  });

program
  .command('change <amount>')
  .description('change bills in register')
  .action(function(args, cb) {

    const cashArr = [];
    const copyCashRegister = Object.assign({}, cashRegister);
    for (const bill in copyCashRegister) {
      while (copyCashRegister[bill] > 0) {
        cashArr.push(Number(bill));
        copyCashRegister[bill]--;
      }
    }
    const cashAvailableArr = cashArr.filter(val => val <= args.amount).sort((small, large) => large - small);

    const result = changeBills(args.amount, cashAvailableArr);
    if (Array.isArray(result)) {
      result.forEach(bill => {
        cashRegister[bill]--;
      });
    } else {
      console.log('SORRY!!!');
    }
    showReg();
    cb();
  });

program
  .command('show')
  .description('show bills in register')
  .action(function(args, cb) {
    showReg();
    cb();
  });

//Entering q quits the program by not invoking action's callback
program
  .command('q')
  .description('Quit cash register')
  .action(function(args, cb) {
    console.log('Quiting Program');
    quitNodemon();
  });

program
  .delimiter('cash_register$')
  .show();

program.parse(process.argv);

function quitNodemon() {
  console.log('nodemon exit');
  process.exit();
}
