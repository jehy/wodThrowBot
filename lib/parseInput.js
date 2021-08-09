'use strict';

const specCommand = ['spec', 's', 'ы'];
const dmgCommand = ['dmg', 'd', 'damage', 'в'];
const summCommand = ['sum', 'summ'];
const maxCommand = ['max'];
const minCommand = ['min'];

function getThrowOptions(options) {
  let special = false;
  let damage = false;
  let action = '';
  let actionMessageStarted = false;
  let sum = false;
  let max = false;
  let min = false;

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
      if (!max && maxCommand.includes(element)) {
        max = true;
        return;
      }
      if (!min && minCommand.includes(element)) {
        min = true;
        return;
      }
      if (!sum && summCommand.includes(element)) {
        sum = true;
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
    sum,
    max,
    min,
  };
}

function getTask(options)
{
  const task = [`throwing ${options.diceNumber} dices`];
  if (!options.sum) {
    task.push(`with ${options.difficulty} difficulty`);
    if (options.special) {
      task.push('using speciality');
    }
    if (options.damage) {
      task.push('(damage, 1 does not subtract)');
    }
  }
  if (options.base !== 10) {
    task.push(`base ${options.base}`);
  }
  return task.join(' ');
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
  const options = str.replace(arr[0], '').trim().split(' ');
  const {
    special, damage, action, sum, max, min,
  } = getThrowOptions(options);
  const difficulty = parseInt(arr[4], 10) || 6;
  if (Number.isNaN(diceNumber)) {
    throw new Error('Wrong value for dice number!');
  }
  if (diceNumber > 30) {
    throw new Error(`Please spare me, Kain! ${diceNumber} dice is too much!`);
  }
  if (difficulty > base) {
    throw new Error(`You don\`t like easy task, yeah? Difficulty ${difficulty} is more then base ${base}`);
  }
  const task = getTask({
    diceNumber, special, damage, action, base, sum, difficulty, max, min,
  });
  return {
    diceNumber, special, damage, action, base, sum, difficulty, task, max, min,
  };
}

module.exports = {parseRequest};
