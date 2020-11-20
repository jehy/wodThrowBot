'use strict';

const crypto = require('crypto');

function randomDice(base) {
  const randHex = crypto.randomBytes(4)
    .toString('hex');
  return parseInt(randHex, 16) % base + 1;
}

const specCommand = ['spec', 's', 'ы'];
const dmgCommand = ['dmg', 'd', 'damage', 'в'];
const summCommand = ['summ'];

function getProps(options) {
  let special = false;
  let damage = false;
  let action = '';
  let actionMessageStarted = false;
  let summ = false;

  options.forEach((element) => {
    if (!actionMessageStarted) {
      if (!special && specCommand.includes(element))
      {
        special = true;
        return;
      }
      if (!damage && dmgCommand.includes(element)) {
        damage = true;
        return;
      }
      if (!summ && summCommand.includes(element)) {
        summ = true;
        return;
      }
    }
    action = `${action} ${element}`.trim();
    actionMessageStarted = true;
  });
  return {
    special,
    damage,
    action,
    summ,
  };
}

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
  // eslint-disable-next-line no-console
  const diceNumber = parseInt(arr[1], 10);
  const base = parseInt(arr[2], 10) || 10;
  const difficulty = parseInt(arr[4], 10) || 6;
  const options = str.replace(arr[0], '').trim().split(' ');
  const {
    special, damage, action, summ,
  } = getProps(options);
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
    difficulty, diceNumber, special, damage, action, base, summ,
  };
}

function throwDices(options) {
  const {
    difficulty, diceNumber, special, damage, base,
  } = options;
  const res = {
    values: [],
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
    res.task += ' (damage, 1 does not subtract)';
  }
  for (let i = 0; i < diceNumber; i++) {
    const val = randomDice(base);
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

const throwStatus = {botch: 1, success: 1, fail: 3};

function getSuccessMessage(success) {
  if (!success.status === throwStatus.botch) {
    return 'Botch!';
  }
  if (success >= 5) {
    return messages[5];
  }
  return messages[success.count];
}

function getSuccesses(res) {
  const difficulty = res.options.difficulty || 6;
  const one = res.values.reduce((acc, val)=>{
    if (val === 1) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const allSuccesses = res.values.reduce((acc, val)=>{
    if (val >= difficulty) {
      if (val === 10 && res.options.special) {
        return acc + 2;
      }
      return acc + 1;
    }
    return acc;
  }, 0);
  const hadSuccesses = allSuccesses > 0;
  if (res.options.damage) {
    const status = allSuccesses > 0 ? throwStatus.success : throwStatus.fail;
    return {count: allSuccesses, status};
  }
  let status;
  const count = Math.max(allSuccesses - one, 0);
  if (!hadSuccesses && one) {
    status = throwStatus.botch;
  } else if (count < 1) {
    status = throwStatus.fail;
  } else {
    status = throwStatus.success;
  }
  return {count, status};
}

function getSumm(res) {
  return res.values.reduce((acc, item)=>item + acc, 0);
}

function parseResult(res) {
  const success = getSuccesses(res);
  return res.options.summ ? {
    values: res.values,
    task: res.task,
    action: res.options.action,
    summ: getSumm(res),
  } : {
    success: success.count,
    values: res.values,
    task: res.task,
    successMessage: getSuccessMessage(success, res),
    action: res.options.action,
  };
}

function resultToStr(res, userName) {
  const str = [`User: @${userName}`, `Task: ${res.task}`];
  if (res.action) {
    str.push(`Action: ${res.action}`);
  }
  str.push(`Result: ${res.values.join(', ')}`);
  if (res.summ) {
    str.push(`Summ: ${res.summ}`);
  } else {
    str.push(`Successes: ${res.success}`);
    str.push(`Message: ${res.successMessage}`);
  }
  return str.join('\n');
}

module.exports = {
  resultToStr,
  parseRequest,
  throwDices,
  parseResult,
  randomDice,
};
