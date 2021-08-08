'use strict';

const throwStatus = {botch: 1, success: 2, fail: 3};

function getSuccesses(params, res) {
  if (!params.difficulty) {
    throw new Error('No difficulty specified');
  }
  const {difficulty} = params;
  const one = res.values.reduce((acc, val)=>{
    if (val === 1) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const allSuccesses = res.values.reduce((acc, val)=>{
    if (val >= difficulty) {
      if (val === 10 && params.special) {
        return acc + 2;
      }
      return acc + 1;
    }
    return acc;
  }, 0);
  const hadSuccesses = allSuccesses > 0;
  if (params.damage) {
    const status = allSuccesses > 0 ? throwStatus.success : throwStatus.fail;
    return {count: allSuccesses, status};
  }
  let status;
  const count = Math.max(allSuccesses - one, 0);
  if (!hadSuccesses && one) {
    status = throwStatus.botch;
  } else if (count < 1) {
    status = throwStatus.fail;
  } else {
    status = throwStatus.success;
  }
  return {count, status};
}

function getSum(res) {
  return res.values.reduce((acc, item)=>item + acc);
}

function getMax(res) {
  return res.values.reduce((acc, item)=>Math.max(acc, item));
}

function getMin(res) {
  return res.values.reduce((acc, item)=>Math.min(acc, item));
}

module.exports = {
  getSuccesses, getSum, throwStatus, getMax, getMin,
};
