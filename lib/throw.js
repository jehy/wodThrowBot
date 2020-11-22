'use strict';

const crypto = require('crypto');

function randomDice(base) {
  const randHex = crypto.randomBytes(4)
    .toString('hex');
  return parseInt(randHex, 16) % base + 1;
}

function throwDices(options) {
  const {
    diceNumber, base,
  } = options;
  const values = [];
  for (let i = 0; i < diceNumber; i++) {
    const val = randomDice(base);
    values.push(val);
  }
  return {values, options};
}

module.exports = {throwDices, randomDice};
