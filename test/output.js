'use strict';

const debug = require('debug')('throwBot:test');
const {assert} = require('chai');

const {parseResult, resultToStr} = require('../lib/output');
const {parseRequest} = require('../lib/parseInput');
const {throwDices} = require('../lib/throw');

describe('passing message', () => {

  // those tests are really bad and should be rewritten
  it('should be able to pass message (no flags, no difficulty)', () => {
    const test = '5 Blah-blah blah!';
    const params = parseRequest(test);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 6);
    assert.equal(params.damage, false);
    assert.equal(params.special, false);
    assert.equal(params.action, 'Blah-blah blah!');
    const res = throwDices(params);
    const reply = parseResult(params, res);
    const resStr = resultToStr(reply);
    assert.isNotTrue(resStr.includes('damage'));
    assert.isNotTrue(resStr.includes('special'));
    assert.isTrue(resStr.includes('Action: Blah-blah blah!'));
    debug(test);
    debug(resStr);
  });

  it('should be able to pass message (no flags, difficulty)', () => {
    const test = '5x8 Blah-blah blah!';
    const params = parseRequest(test);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 8);
    assert.equal(params.damage, false);
    assert.equal(params.special, false);
    assert.equal(params.action, 'Blah-blah blah!');
    const res = throwDices(params);
    const reply = parseResult(params, res);
    const resStr = resultToStr(reply);
    assert.isNotTrue(resStr.includes('damage'));
    assert.isNotTrue(resStr.includes('special'));
    assert.isTrue(resStr.includes('Action: Blah-blah blah!'));
    debug(test);
    debug(resStr);
  });

  it('should be able to pass (all flags)', () => {
    const test = '5x8 spec damage Blah-blah blah!';
    const params = parseRequest(test);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 8);
    assert.equal(params.damage, true);
    assert.equal(params.special, true);
    assert.equal(params.action, 'Blah-blah blah!');
    const res = throwDices(params);
    const reply = parseResult(params, res);
    const resStr = resultToStr(reply);
    assert.isTrue(resStr.includes('damage'));
    assert.isTrue(resStr.includes('special'));
    assert.isTrue(resStr.includes('Action: Blah-blah blah!'));
    debug(test);
    debug(resStr);
  });
  it('should be able to fuck goose', () => {
    const test = '5x7 еби гусей';
    const params = parseRequest(test);
    assert.equal(params.diceNumber, 5);
    assert.equal(params.difficulty, 7);
    assert.equal(params.damage, false);
    assert.equal(params.special, false);
    assert.equal(params.action, 'еби гусей');
    const res = throwDices(params);
    const reply = parseResult(params, res);
    const resStr = resultToStr(reply);
    assert.isNotTrue(resStr.includes('damage'));
    assert.isNotTrue(resStr.includes('special'));
    assert.isTrue(resStr.includes('Action: еби гусей'));
    debug(test);
    debug(resStr);
  });
});
