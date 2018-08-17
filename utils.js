'use strict';

const crypto = require('crypto');

function randomDice() {
  const randHex = crypto.randomBytes(4)
    .toString('hex');
  return parseInt(randHex, 16) % 10;
}

function parseRequest(str) {
  str = str.trim();
  let difficulty = 6;
  let special = false;
  let damage = false;
  const arr = str.trim().replace('х', 'x').replace('x', ' ').split(' ').map(el=>el.trim());
  const diceNumber = parseInt(arr[0], 10);
  if (!Number.isNaN(parseInt(arr[1], 10)))
  {
    difficulty = parseInt(arr[1], 10);
  }
  if (arr.includes('spec') || arr.includes('s')) {
    special = true;
  }
  if (arr.includes('dmg') || arr.includes('d') || arr.includes('damage')) {
    damage = true;
  }
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
    difficulty, diceNumber, special, damage,
  };
}

function throwDices(options) {
  const {difficulty, diceNumber, special, damage} = options;
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
  const result = {success: res.success, values: res.values, task: res.task};
  if (result.success === 0 && res.one > 0 && !res.options.damage) {
    result.msg = 'Botch!';
    return result;
  }
  if (!res.options.damage)
  {
    result.success -= res.one;
  }
  if (result.success < 0) {
    result.success = 0;
  }
  if (result.success === 0) {
    result.msg = 'Fail!';
    return result;
  }
  if (result.success === 1) {
    result.msg = 'Success... Marginal.';
    return result;
  }
  if (result.success === 2) {
    result.msg = 'Success... Moderate.';
    return result;
  }
  if (result.success === 3) {
    result.msg = 'Success. Complete!';
    return result;
  }
  if (result.success === 4) {
    result.msg = 'Success. Exceptional!!';
    return result;
  }
  result.msg = 'Success!!! Phenomenal!!!';
  return result;
}

function resultToStr(res) {
  return `Task: ${res.task}\nResult: ${res.values.join(', ')}\nSuccesses: ${res.success}\nMessage: ${res.msg}`;
}

module.exports = {
  resultToStr,
  parseRequest,
  throwDices,
  parseResult,
  randomDice,
};
