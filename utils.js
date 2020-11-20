'use strict';

const crypto = require('crypto');

function randomDice(base) {
  const randHex = crypto.randomBytes(4)
    .toString('hex');
  return parseInt(randHex, 16) % base + 1;
}

const specCommand = ['spec', 's', 'ы'];
const dmgCommand = ['dmg', 'd', 'damage', 'в'];

function parseRequest(str) {
  /* let difficulty = 6;
  // support for old syntax with x, both russian and english
  if (str[0] === 'x' || str[1] === 'x') { // eng
    str = str.replace('x', ' ');
  }
  if (str[0] === 'х' || str[1] === 'х') { // rus
    str = str.replace('х', ' ');
  }
  const arr = str.trim().split(' ').map((el) => el.trim());
  const diceNumber = parseInt(arr[0], 10);
  if (!Number.isNaN(parseInt(arr[1], 10))) {
    difficulty = parseInt(arr[1], 10);
  } */
  if (str.length > 120) {
    throw new Error('You really like long things, dont you?');
  }
  const arr = str.match(/(\d{0,2})d{0,1}(\d{0,2})(x|х{0,1})(\d{0,2})/i);
  // console.log(`${str}=>${JSON.stringify(arr)}`);
  const diceNumber = parseInt(arr[1], 10);
  const base = parseInt(arr[2], 10) || 10;
  const difficulty = parseInt(arr[4], 10) || 6;
  const options = str.replace(arr[0], '').trim().split(' ');
  const {special, damage, action} = options.reduce((res, element, index) => {
    if (!res.actionMessageStarted && !res.special && specCommand.includes(element) && index < 4) {
      res.special = true;
      return res;
    }
    if (!res.actionMessageStarted && !res.damage && dmgCommand.includes(element) && index < 4) {
      res.damage = true;
      return res;
    }
    res.action = `${res.action} ${element}`.trim();
    res.actionMessageStarted = true;
    return res;
  }, {
    special: false,
    damage: false,
    action: '',
    actionMessageStarted: false,
  });
  if (Number.isNaN(diceNumber)) {
    throw new Error('Wrong value for dice number!');
  }
  if (diceNumber > 30) {
    throw new Error('Please spare me, Kain!');
  }
  if (difficulty > base) {
    throw new Error('You don`t like easy task, yeah?');
  }
  return {
    difficulty, diceNumber, special, damage, action, base,
  };
}

function throwDices(options) {
  const {
    difficulty, diceNumber, special, damage, base,
  } = options;
  const res = {
    values: [],
    one: 0,
    success: 0,
    task: `throwing ${diceNumber} dices with ${difficulty} difficulty`,
    options,
  };
  if (base !== 10) {
    res.task += ` base ${base}`;
  }
  if (special) {
    res.task += ' using speciality';
  }
  if (damage) {
    res.task += ' (damage, 1 is only fail)';
  }
  for (let i = 0; i < diceNumber; i++) {
    const val = randomDice(base);
    if (val === 1) {
      res.one++;
    }
    else if (val === 10) {
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

const messages = [
  'Fail!',
  'Success... Marginal.',
  'Success... Moderate.',
  'Success. Complete!',
  'Success. Exceptional!!',
  'Success!!! Phenomenal!!!',
];

function parseResult(res) {
  const result = {
    success: res.success,
    values: res.values,
    task: res.task,
    message: res.options.message,
    action: res.options.action,
  };
  if (result.success === 0 && res.one > 0 && !res.options.damage) {
    result.msg = 'Botch!';
    return result;
  }
  if (!res.options.damage) {
    result.success = Math.max(result.success - res.one, 0);
  }
  if (result.success >= 5) {
    result.msg = messages[5];
  }
  else {
    result.msg = messages[result.success];
  }
  return result;
}

function resultToStr(res, userName) {
  const action = res.action && (`Action: ${res.action}\n`) || '';
  const userNameStr = userName && (`User: @${userName}\n`) || '';
  return `${userNameStr}Task: ${res.task}\n${action}Result: ${res.values.join(', ')}\nSuccesses: ${res.success}\nMessage: ${res.msg}`;
}

module.exports = {
  resultToStr,
  parseRequest,
  throwDices,
  parseResult,
  randomDice,
};
