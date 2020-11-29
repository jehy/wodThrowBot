'use strict';

const {getSuccesses, getSumm, throwStatus} = require('./count');

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
  if (params.summ) {
    return  {
      values: res.values,
      action: params.action,
      task: params.task,
      summ: getSumm(res),
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
  if (res.summ) {
    if (res.values.length > 1) {
      str.push(`Summ: ${res.summ}`);
    }
  } else {
    str.push(`Successes: ${res.success}`);
    str.push(`Message: ${res.successMessage}`);
  }
  return str.join('\n');
}

module.exports = {resultToStr, parseResult};
