'use strict';

const debug = require('debug')('throwBot:test');
const {assert} = require('chai');

const utils = require('../utils');

describe('Some simple tests', () => {

  it('should be able to throw a hundred dice', () => {

    for (let i = 0; i < 100; i++) {
      utils.randomDice();
    }
  });

  it('should be able to process some inputs', () => {

    for (let i = 0; i < 100; i++) {
      const test = '5x8';
      const params = utils.parseRequest(test);
      const res = utils.throwDices(params);
      const reply = utils.parseResult(res);
      const resStr = utils.resultToStr(reply);
    }
  });
});

describe('Parsing request', () => {
  it('should be able to process russian input', () => {
    const test = '5х8';
    const params = utils.parseRequest(test);
    // eslint-disable-next-line no-console
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 8);
    assert.equal(params.special, false);
    assert.equal(params.damage, false);
    assert.equal(params.action, '');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isNotTrue(resStr.includes('damage'));
    assert.isNotTrue(resStr.includes('special'));
    assert.isNotTrue(resStr.includes('action'));
    debug(test);
    debug(resStr);
  });

  it('should be able to process english input', () => {
    const test = '5x8';
    const params = utils.parseRequest(test);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 8);
    assert.equal(params.special, false);
    assert.equal(params.damage, false);
    assert.equal(params.action, '');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isNotTrue(resStr.includes('damage'));
    assert.isNotTrue(resStr.includes('special'));
    assert.isNotTrue(resStr.includes('action'));
    debug(test);
    debug(resStr);
  });

  it('should be able to process speciality throws', () => {
    const test = '5x8 spec';
    const test2 = '5х8 s';
    const test3 = '5x8 ы';
    const params = utils.parseRequest(test);
    const params2 = utils.parseRequest(test2);
    const params3 = utils.parseRequest(test3);
    assert.deepEqual(params, params2);
    assert.deepEqual(params, params3);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 8);
    assert.equal(params.special, true);
    assert.equal(params.damage, false);
    assert.equal(params.action, '');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isNotTrue(resStr.includes('damage'));
    assert.isTrue(resStr.includes('special'));
    assert.isNotTrue(resStr.includes('action'));
    debug(test);
    debug(resStr);
  });

  it('should be able to process damage throws', () => {
    const test = '5x8 damage';
    const test2 = '5x8 dmg';
    const test3 = '5x8 d';
    const test4 = '5x8 в';
    const params = utils.parseRequest(test);
    const params2 = utils.parseRequest(test2);
    const params3 = utils.parseRequest(test3);
    const params4 = utils.parseRequest(test4);
    assert.deepEqual(params, params2);
    assert.deepEqual(params, params3);
    assert.deepEqual(params, params4);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 8);
    assert.equal(params.damage, true);
    assert.equal(params.special, false);
    assert.equal(params.action, '');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isTrue(resStr.includes('damage'));
    assert.isNotTrue(resStr.includes('special'));
    assert.isNotTrue(resStr.includes('action'));
    debug(test);
    debug(resStr);
  });

  it('should be able to process both speciality and damage throws', () => {
    const test = '5x8 damage spec';
    const test2 = '5x8 spec dmg';
    const test3 = '5x8 d s';
    const test4 = '5x8 ы в';
    const params = utils.parseRequest(test);
    const params2 = utils.parseRequest(test2);
    const params3 = utils.parseRequest(test3);
    const params4 = utils.parseRequest(test4);
    assert.deepEqual(params, params2);
    assert.deepEqual(params, params3);
    assert.deepEqual(params, params4);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 8);
    assert.equal(params.damage, true);
    assert.equal(params.special, true);
    assert.equal(params.action, '');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isTrue(resStr.includes('damage'));
    assert.isTrue(resStr.includes('special'));
    assert.isNotTrue(resStr.includes('action'));
    debug(test);
    debug(resStr);
  });

});

describe('counting successes', () => {

  it('should count simple successes', () => {
    const diceResult = {
      values: [6, 7],
      task: 'some task',
      options: {
        action: 'some action',
      },
    };
    const reply = utils.parseResult(diceResult);
    assert.deepEqual(reply, {
      success: 2,
      values: [6, 7],
      task: 'some task',
      successMessage: 'Success... Moderate.',
      action: 'some action',
    });
  });

  it('should count successes and subtract botches', () => {
    const diceResult = {
      values: [1, 7],
      task: 'some task',
      options: {
        action: 'some action',
      },
    };
    const reply = utils.parseResult(diceResult);
    assert.deepEqual(reply, {
      success: 0,
      values: [1, 7],
      task: 'some task',
      action: 'some action',
      successMessage: 'Fail!',
    });
  });

  it('should count successes and not subtract botches in damage mode', () => {
    const diceResult = {
      values: [1, 7],
      task: 'some task',
      options: {
        action: 'some action',
        damage: true,
      },
    };
    const reply = utils.parseResult(diceResult);
    assert.deepEqual(reply, {
      success: 1,
      values: [1, 7],
      task: 'some task',
      action: 'some action',
      successMessage: 'Success... Marginal.',
    });
  });

  it('should count successes when using speciality', () => {
    const diceResult = {
      values: [5, 10],
      task: 'some task',
      options: {
        action: 'some action',
        special: true,
      },
    };
    const reply = utils.parseResult(diceResult);
    assert.deepEqual(reply, {
      success: 2,
      values: [5, 10],
      task: 'some task',
      action: 'some action',
      successMessage: 'Success... Moderate.',
    });
  });

  it('should count successes when using speciality and damage mode', () => {
    const diceResult = {
      values: [5, 10, 1],
      task: 'some task',
      options: {
        action: 'some action',
        damage: true,
        special: true,
      },
    };
    const reply = utils.parseResult(diceResult);
    assert.deepEqual(reply, {
      success: 2,
      values: [5, 10, 1],
      task: 'some task',
      action: 'some action',
      successMessage: 'Success... Moderate.',
    });
  });
  it('should count summ', () => {
    const diceResult = {
      values: [1, 2, 3],
      task: 'some task',
      options: {
        action: 'some action',
        summ: true,
      },
    };
    const reply = utils.parseResult(diceResult);
    assert.deepEqual(reply, {
      values: [1, 2, 3],
      task: 'some task',
      action: 'some action',
      summ: 6,
    });
  });
});
describe('passing message', () => {

  it('should be able to pass message (no flags, no difficulty)', () => {
    const test = '5 Blah-blah blah!';
    const params = utils.parseRequest(test);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 6);
    assert.equal(params.damage, false);
    assert.equal(params.special, false);
    assert.equal(params.action, 'Blah-blah blah!');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isNotTrue(resStr.includes('damage'));
    assert.isNotTrue(resStr.includes('special'));
    assert.isTrue(resStr.includes('Action: Blah-blah blah!'));
    debug(test);
    debug(resStr);
  });

  it('should be able to pass message (no flags, difficulty)', () => {
    const test = '5x8 Blah-blah blah!';
    const params = utils.parseRequest(test);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 8);
    assert.equal(params.damage, false);
    assert.equal(params.special, false);
    assert.equal(params.action, 'Blah-blah blah!');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isNotTrue(resStr.includes('damage'));
    assert.isNotTrue(resStr.includes('special'));
    assert.isTrue(resStr.includes('Action: Blah-blah blah!'));
    debug(test);
    debug(resStr);
  });

  it('should be able to pass (all flags)', () => {
    const test = '5x8 spec damage Blah-blah blah!';
    const params = utils.parseRequest(test);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 8);
    assert.equal(params.damage, true);
    assert.equal(params.special, true);
    assert.equal(params.action, 'Blah-blah blah!');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isTrue(resStr.includes('damage'));
    assert.isTrue(resStr.includes('special'));
    assert.isTrue(resStr.includes('Action: Blah-blah blah!'));
    debug(test);
    debug(resStr);
  });
  it('should be able to fuck goose', () => {
    const test = '5x7 еби гусей';
    const params = utils.parseRequest(test);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 7);
    assert.equal(params.damage, false);
    assert.equal(params.special, false);
    assert.equal(params.action, 'еби гусей');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isNotTrue(resStr.includes('damage'));
    assert.isNotTrue(resStr.includes('special'));
    assert.isTrue(resStr.includes('Action: еби гусей'));
    debug(test);
    debug(resStr);
  });
  it('should be able to endure Rider roll', () => {
    const test = '6x7 No damage intended!';
    const params = utils.parseRequest(test);
    assert.equal(params.diceNumber, 6);
    assert.equal(params.difficulty, 7);
    assert.equal(params.damage, false);
    assert.equal(params.special, false);
    assert.equal(params.action, 'No damage intended!');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isTrue(resStr.includes('Action: No damage intended!'));
    debug(test);
    debug(resStr);
  });
  it('should be able to endure Rider roll (2)', () => {
    const test = '5x6 damage Damage to troll';
    const params = utils.parseRequest(test);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 6);
    assert.equal(params.damage, true);
    assert.equal(params.special, false);
    assert.equal(params.action, 'Damage to troll');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isTrue(resStr.includes('Action: Damage to troll'));
    debug(test);
    debug(resStr);
  });
  it('should be able to throw using base', () => {
    const test = '5d6x6 damage d6 damage';
    const params = utils.parseRequest(test);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 6);
    assert.equal(params.damage, true);
    assert.equal(params.base, 6);
    assert.equal(params.special, false);
    assert.equal(params.action, 'd6 damage');
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    assert.isTrue(resStr.includes('Action: d6 damage'));
    debug(test);
    debug(resStr);
  });
});
