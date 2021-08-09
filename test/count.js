'use strict';

const {assert} = require('chai');

const {parseResult} = require('../lib/output');

describe('counting successes', () => {

  it('should count simple successes', () => {
    const diceResult = {
      values: [6, 7],
    };
    const params = {task: 'some task', action: 'some action', difficulty: 6};
    const reply = parseResult(params, diceResult);
    assert.deepEqual(reply, {
      success: 2,
      values: [6, 7],
      successMessage: 'Success... Moderate.',
      task: 'some task',
      action: 'some action',
    });
  });

  it('should count successes and subtract botches', () => {
    const diceResult = {
      values: [1, 7],
    };
    const params = {task: 'some task', action: 'some action', difficulty: 6};
    const reply = parseResult(params, diceResult);
    assert.deepEqual(reply, {
      success: 0,
      values: [1, 7],
      task: 'some task',
      action: 'some action',
      successMessage: 'Fail!',
    });
  });

  it('should count botches as botches', () => {
    const diceResult = {
      values: [1, 5, 4, 4, 1, 5],
    };
    const params = {task: 'some task', action: 'some action', difficulty: 6};
    const reply = parseResult(params, diceResult);
    assert.deepEqual(reply, {
      success: 0,
      values: [1, 5, 4, 4, 1, 5],
      task: 'some task',
      action: 'some action',
      successMessage: 'Botch!',
    });
  });

  it('should count successes and not subtract botches in damage mode', () => {
    const diceResult = {
      values: [1, 7],
    };
    const params = {
      task: 'some task', action: 'some action', damage: true, difficulty: 6,
    };
    const reply = parseResult(params, diceResult);
    assert.deepEqual(reply, {
      success: 1,
      values: [1, 7],
      task: 'some task',
      action: 'some action',
      successMessage: 'Success... Marginal.',
    });
  });

  it('should count successes when using speciality', () => {
    const params = {
      task: 'some task', action: 'some action', special: true, difficulty: 6,
    };
    const diceResult = {
      values: [5, 10],
    };
    const reply = parseResult(params, diceResult);
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
    };
    const params = {
      task: 'some task', action: 'some action', damage: true, special: true, difficulty: 6,
    };
    const reply = parseResult(params, diceResult);
    assert.deepEqual(reply, {
      success: 2,
      values: [5, 10, 1],
      task: 'some task',
      action: 'some action',
      successMessage: 'Success... Moderate.',
    });
  });
  it('should count sum', () => {
    const diceResult = {
      values: [1, 2, 3],
    };
    const params = {
      task: 'some task', action: 'some action', sum: true, difficulty: 6,
    };
    const reply = parseResult(params, diceResult);
    assert.deepEqual(reply, {
      values: [1, 2, 3],
      action: 'some action',
      task: 'some task',
      sum: 6,
    });
  });
  it('should count max', () => {
    const diceResult = {
      values: [1, 2, 3],
    };
    const params = {
      task: 'some task', action: 'some action', max: true, difficulty: 6,
    };
    const reply = parseResult(params, diceResult);
    assert.deepEqual(reply, {
      values: [1, 2, 3],
      action: 'some action',
      task: 'some task',
      max: 3,
    });
  });
  it('should count min', () => {
    const diceResult = {
      values: [1, 2, 3],
    };
    const params = {
      task: 'some task', action: 'some action', min: true, difficulty: 6,
    };
    const reply = parseResult(params, diceResult);
    assert.deepEqual(reply, {
      values: [1, 2, 3],
      action: 'some action',
      task: 'some task',
      min: 1,
    });
  });
});
