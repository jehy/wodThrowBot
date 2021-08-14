'use strict';

const {parseResult, resultToStr} = require('../lib/output');
const {parseRequest} = require('../lib/parseInput');
const {throwDices, randomDice} = require('../lib/throw');

describe('Some simple tests', () => {

  it('should be able to throw a hundred dice', () => {

    for (let i = 0; i < 100; i++) {
      randomDice();
    }
  });

  it('should be able to throw many dice equally', () => {

    const randMap = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };
    for (let i = 0; i < 100 * 1000; i++) {
      const res = randomDice(6);
      randMap[res]++;
    }
    // eslint-disable-next-line no-console
    console.log(randMap);
  });

  describe('should be able to process some inputs', () => {
    const tests = ['5x8', '3d6x6', '3d6 sum', '3d6 sum', '5d6x4 sum damage spec'];
    tests.forEach((test)=>{
      it(test, ()=>{
        for (let i = 0; i < 100; i++) {
          const params = parseRequest(test);
          const res = throwDices(params);
          const reply = parseResult(params, res);
          const resStr = resultToStr(reply);
        }
      });
    });
  });
});
