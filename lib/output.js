'use strict';

const {
  getSuccesses, getSum, getMax, throwStatus,
} = require('./count');

const messages = [
  'Fail!',
  'Success... Marginal.',
  'Success... Moderate.',
  'Success. Complete!',
  'Success. Exceptional!!',
  'Success!!! Phenomenal!!!',
];

function getSuccessMessage(success) {
  if (success.status === throwStatus.botch) {
    return 'Botch!';
  }
  if (success >= 5) {
    return messages[5];
  }
  return messages[success.count];
}

function parseResult(params, res) {
  if (params.sum) {
    return  {
      values: res.values,
      action: params.action,
      task: params.task,
      sum: getSum(res),
    };
  }
  if (params.max) {
    return  {
      values: res.values,
      action: params.action,
      task: params.task,
      max: getMax(res),
    };
  }

  const success = getSuccesses(params, res);
  return {
    success: success.count,
    values: res.values,
    successMessage: getSuccessMessage(success, res),
    action: params.action,
    task: params.task,
  };
}

function resultToStr(res, userName) {
  const str = [`User: @${userName}`, `Task: ${res.task}`];
  if (res.action) {
    str.push(`Action: ${res.action}`);
  }
  str.push(`Result: ${res.values.join(', ')}`);
  if (res.sum) {
    if (res.values.length > 1) {
      str.push(`Sum: ${res.sum}`);
    }
  }
  else if (res.max) {
    str.push(`Max: ${res.max}`);
  } else {
    str.push(`Successes: ${res.success}`);
    str.push(`Message: ${res.successMessage}`);
  }
  return str.join('\n');
}

module.exports = {resultToStr, parseResult};
