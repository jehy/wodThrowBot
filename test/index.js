'use strict';

const debug = require('debug')('throwBot:test');
const assert = require('chai').assert;

const utils = require('../utils');

describe('Some simple tests', ()=>{

  it('should be able to throw a hundred dice', ()=>{

    for (let i = 0; i < 100; i++)
    {
      utils.randomDice();
    }
  });

  it('should be able to process some inputs', ()=>{

    for (let i = 0; i < 100; i++)
    {
      const test = '5x8';
      const params = utils.parseRequest(test);
      const res = utils.throwDices(params);
      const reply = utils.parseResult(res);
      const resStr = utils.resultToStr(reply);
    }
  });


  describe('Parsing request', ()=>{
    it('should be able to process russian input', ()=>{
      const test = '5х8';
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

    it('should be able to process english input', ()=>{
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

    it('should be able to process input without "x"', ()=>{
      const test = '5 8';
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


    it('should be able to process speciality throws', ()=>{
      const test = '5 8 spec';
      const test2 = '5 8 s';
      const test3 = '5 8 ы';
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

    it('should be able to process damage throws', ()=>{
      const test = '5 8 damage';
      const test2 = '5 8 dmg';
      const test3 = '5 8 d';
      const test4 = '5 8 в';
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

    it('should be able to process both speciality and damage throws', ()=>{
      const test = '5 8 damage spec';
      const test2 = '5 8 spec dmg';
      const test3 = '5 8 d s';
      const test4 = '5 8 ы в';
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

    describe('passing message', ()=>{

      it('should be able to pass message (no flags, no difficulty)', ()=>{
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


      it('should be able to pass message (no flags, difficulty)', ()=>{
        const test = '5 8 Blah-blah blah!';
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


      it('should be able to pass (all flags)', ()=>{
        const test = '5 8 spec damage Blah-blah blah!';
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
      it('should be able to fuck goose', ()=>{
        const test = '5 7 еби гусей';
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
    });
  });

});
