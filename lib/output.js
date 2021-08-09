'use strict';

const {
  getSuccesses, getSum, getMax, getMin, throwStatus,
} = require('./count');

const resultMessages = [
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
    return resultMessages[5];
  }
  return resultMessages[success.count];
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
  if (params.min) {
    return  {
      values: res.values,
      action: params.action,
      task: params.task,
      min: getMin(res),
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
  const messages = [`User: @${userName}`, `Task: ${res.task}`];
  if (res.action) {
    messages.push(`Action: ${res.action}`);
  }
  messages.push(`Result: ${res.values.join(', ')}`);
  if (res.sum) {
    if (res.values.length > 1) {
      messages.push(`Sum: ${res.sum}`);
    }
  }
  else if (res.max) {
    messages.push(`Max: ${res.max}`);
  }   else if (res.min) {
    messages.push(`Min: ${res.min}`);
  } else {
    messages.push(`Successes: ${res.success}`);
    messages.push(`Message: ${res.successMessage}`);
  }
  return messages.join('\n');
}

module.exports = {resultToStr, parseResult};
