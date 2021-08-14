'use strict';

const crypto = require('crypto');

function randomDiceCrypto(base) {
  const randHex = crypto.randomBytes(4)
    .toString('hex');
  return parseInt(randHex, 16) % base + 1;
}

function randomDiceSimple(base) {
  return Math.floor(Math.random() * base) + 1;
}
const randomDice = randomDiceSimple;

function throwDices(options) {
  const {
    diceNumber, base,
  } = options;
  const values = new Array(diceNumber).fill(0).map(()=>randomDice(base));
  return {values, options};
}

module.exports = {throwDices, randomDice};
