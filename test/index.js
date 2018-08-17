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
      // debug(resStr);
    }
  });


  it('should be able to process russian input', ()=>{
    const test = '5х8';
    const params = utils.parseRequest(test);
    const res = utils.throwDices(params);
    const reply = utils.parseResult(res);
    const resStr = utils.resultToStr(reply);
    debug(resStr);
  });


  it('should be able to process speciality throws', ()=>{
    for (let i = 0; i < 10; i++)
    {
      const test = '5x8 spec';
      const params = utils.parseRequest(test);
      const res = utils.throwDices(params);
      const reply = utils.parseResult(res);
      const resStr = utils.resultToStr(reply);
      debug(resStr);
    }
  });

  it('should be able to process damage throws', ()=>{
    for (let i = 0; i < 10; i++)
    {
      const test = '5x8 damage';
      const params = utils.parseRequest(test);
      const res = utils.throwDices(params);
      const reply = utils.parseResult(res);
      const resStr = utils.resultToStr(reply);
      debug(resStr);
    }
  });

  it('should be able to process speciality and damage throws', ()=>{
    for (let i = 0; i < 10; i++)
    {
      const test = '5x8 spec damage';
      const params = utils.parseRequest(test);
      const res = utils.throwDices(params);
      const reply = utils.parseResult(res);
      const resStr = utils.resultToStr(reply);
      debug(resStr);
    }
  });

  it('should be able to pass message', ()=>{
    for (let i = 0; i < 10; i++)
    {
      const test = '5 8 spec damage message Blah-blah blah!';
      const params = utils.parseRequest(test);
      const res = utils.throwDices(params);
      const reply = utils.parseResult(res);
      const resStr = utils.resultToStr(reply);
      assert.length(res.values, 5);
      assert.isTrue(resStr.indexOf('Blah-blah blah!') > -1);
      debug(resStr);
    }
  });

});
