'use strict';

const {assert} = require('chai');

const {parseRequest} = require('../lib/parseInput');

describe('Parsing request', () => {
  it('should be able to process russian input', () => {
    const test = '5х8';
    const params = parseRequest(test);
    assert.deepEqual(params, {
      diceNumber: 5,
      special: false,
      damage: false,
      action: '',
      base: 10,
      sum: false,
      difficulty: 8,
      task: 'throwing 5 dices with 8 difficulty',
      max: false,
      min: false,
    });
  });

  it('should be able to process english input', () => {
    const test = '5x8';
    const params = parseRequest(test);
    assert.deepEqual(params, {
      diceNumber: 5,
      special: false,
      damage: false,
      action: '',
      base: 10,
      sum: false,
      difficulty: 8,
      task: 'throwing 5 dices with 8 difficulty',
      max: false,
      min: false,
    });
  });

  it('should be able parse actions without mess', () => {
    const test = '5x6 damage Damage to troll';
    const params = parseRequest(test);
    assert.deepEqual(params, {
      diceNumber: 5,
      special: false,
      damage: true,
      action: 'Damage to troll',
      base: 10,
      sum: false,
      difficulty: 6,
      task: 'throwing 5 dices with 6 difficulty (damage, 1 does not subtract)',
      max: false,
      min: false,
    });

    const test2 = '6x7 No damage intended!';
    const params2 = parseRequest(test2);
    assert.deepEqual(params2, {
      diceNumber: 6,
      special: false,
      damage: false,
      action: 'No damage intended!',
      base: 10,
      sum: false,
      difficulty: 7,
      task: 'throwing 6 dices with 7 difficulty',
      max: false,
      min: false,
    });
  });

  it('should be able to process speciality throws', () => {
    const test = '5x8 spec';
    const test2 = '5х8 s';
    const test3 = '5x8 ы';
    const params = parseRequest(test);
    const params2 = parseRequest(test2);
    const params3 = parseRequest(test3);
    assert.deepEqual(params, params2);
    assert.deepEqual(params, params3);
    assert.deepEqual(params, {
      diceNumber: 5,
      special: true,
      damage: false,
      action: '',
      base: 10,
      sum: false,
      difficulty: 8,
      task: 'throwing 5 dices with 8 difficulty using speciality',
      max: false,
      min: false,
    });
  });

  it('should be able to process damage throws', () => {
    const test = '5x8 damage';
    const test2 = '5x8 dmg';
    const test3 = '5x8 d';
    const test4 = '5x8 в';
    const params = parseRequest(test);
    const params2 = parseRequest(test2);
    const params3 = parseRequest(test3);
    const params4 = parseRequest(test4);
    assert.deepEqual(params, params2);
    assert.deepEqual(params, params3);
    assert.deepEqual(params, params4);
    assert.deepEqual(params, {
      diceNumber: 5,
      special: false,
      damage: true,
      action: '',
      base: 10,
      sum: false,
      difficulty: 8,
      task: 'throwing 5 dices with 8 difficulty (damage, 1 does not subtract)',
      max: false,
      min: false,
    });
  });

  it('should be able to process both speciality and damage throws', () => {
    const test = '5x8 damage spec';
    const test2 = '5x8 spec dmg';
    const test3 = '5x8 d s';
    const test4 = '5x8 ы в';
    const params = parseRequest(test);
    const params2 = parseRequest(test2);
    const params3 = parseRequest(test3);
    const params4 = parseRequest(test4);
    assert.deepEqual(params, params2);
    assert.deepEqual(params, params3);
    assert.deepEqual(params, params4);
    assert.deepEqual(params, {
      diceNumber: 5,
      special: true,
      damage: true,
      action: '',
      base: 10,
      sum: false,
      difficulty: 8,
      task: 'throwing 5 dices with 8 difficulty using speciality (damage, 1 does not subtract)',
      max: false,
      min: false,
    });
  });

  it('should be able to process min and max commands', () => {
    const test = '5d6x4 max min summ';
    const params = parseRequest(test);
    assert.deepEqual(params, {
      diceNumber: 5,
      special: false,
      damage: false,
      action: '',
      base: 6,
      sum: true,
      difficulty: 4,
      task: 'throwing 5 dices base 6',
      max: true,
      min: true,
    });
  });

});
