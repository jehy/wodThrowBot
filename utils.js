'use strict';

const crypto = require('crypto');

function randomDice() {
  const randHex = crypto.randomBytes(4)
    .toString('hex');
  return parseInt(randHex, 16) % 10;
}

const specCommand = ['spec', 's', 'ы'];
const dmgCommand = ['dmg', 'd', 'damage', 'в'];
const messageCommand = ['message', 'm', 'ь'];

function parseRequest(str) {
  let difficulty = 6;
  let special = false;
  let damage = false;
  let message = '';
  const arr = str.trim().split(' ').map(el=>el.trim());
  const diceNumber = parseInt(arr[0], 10);
  if (!Number.isNaN(parseInt(arr[1], 10)))
  {
    difficulty = parseInt(arr[1], 10);
  }
  arr.every((element, index, array) => {
    if (specCommand.indexOf(element) > -1) {
      special = true;
      return true;
    }
    if (dmgCommand.indexOf(element) > -1) {
      damage = true;
      return true;
    }
    if (messageCommand.indexOf(element) > -1) {
      message = array.slice(index + 1).join(' ');
      return false;
    }
    return true;
  });
  if (Number.isNaN(diceNumber)) {
    throw new Error('Wrong value for dice number!');
  }
  if (diceNumber > 20) {
    throw new Error('Please spare me, Kain!');
  }
  if (difficulty > 10) {
    throw new Error('You don`t like easy task, yeah?');
  }
  return {
    difficulty, diceNumber, special, damage, message,
  };
}

function throwDices(options) {
  const {
    difficulty, diceNumber, special, damage, message,
  } = options;
  const res = {
    values: [],
    one: 0,
    success: 0,
    task: `throwing ${diceNumber} dices with ${difficulty} difficulty`,
    options,
  };
  if (special) {
    res.task += ' using speciality';
  }
  if (damage) {
    res.task += ' (damage, 1 is only fail)';
  }
  for (let i = 0; i < diceNumber; i++) {
    const val = randomDice();
    if (val === 1) {
      res.one++;
    }
    else if (val === 0) {
      if (special) {
        res.success += 2;
      }
      else res.success++;
    }
    else if (val >= difficulty) {
      res.success++;
    }
    res.values.push(val);
  }
  return res;
}

function parseResult(res) {
  const result = {success: res.success, values: res.values, task: res.task, message: res.options.message};
  if (result.success === 0 && res.one > 0 && !res.options.damage) {
    result.msg = 'Botch!';
    return result;
  }
  if (!res.options.damage)
  {
    result.success = Math.max(result.success - res.one, 0);
  }
  switch (result.success) {
    case 0: result.msg = 'Fail!';
      break;
    case 1: result.msg = 'Success... Marginal.';
      break;
    case 2: result.msg = 'Success... Moderate.';
      break;
    case 3: result.msg = 'Success. Complete!';
      break;
    case 4: result.msg = 'Success. Exceptional!!';
      break;
    default: result.msg = 'Success!!! Phenomenal!!!';
  }
  return result;
}

function resultToStr(res) {
  return `Task: ${res.task}\n${res.message}\nResult: ${res.values.join(', ')}\nSuccesses: ${res.success}\nMessage: ${res.msg}`;
}

module.exports = {
  resultToStr,
  parseRequest,
  throwDices,
  parseResult,
  randomDice,
};
