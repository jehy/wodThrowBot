const crypto = require('crypto'),
  TelegramBot = require('node-telegram-bot-api'),
  config = require('./config/config.json');

// replace the value below with the Telegram token you receive from @BotFather
const token = config.telegram.token;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

function randomDice() {
  const randHex = crypto.randomBytes(4)
    .toString('hex');
  return parseInt(randHex, 16) % 10;
}

/* test
console.log(randomDice());

const res = {};
for (let i = 0; i < 10000; i++) {
  const val = randomDice();
  if (res[val]===undefined) {
    res[val] = 0;
  }
  else {
    res[val]++
  }
}
console.log(res);
*/
function parseRequest(str) {
  str = str.trim();
  let difficulty = 6;
  let diceNumber = str;
  let special = false;
  if (str.indexOf('spec') !== -1) {
    special = true;
    str = str.replace('spec', '').trim();
  }
  if (str.indexOf('x') !== -1) {
    const arr = str.split('x');
    if (arr.length > 2) {
      throw new Error('too many x!');
    }
    difficulty = arr[1];
    diceNumber = arr[0];
  }
  difficulty = parseInt(difficulty);
  diceNumber = parseInt(diceNumber);
  if (isNaN(difficulty)) {
    throw new Error('Wrong value for difficulty!');
  }
  if (isNaN(diceNumber)) {
    throw new Error('Wrong value for dice number!');
  }
  if (diceNumber > 20) {
    throw new Error('Please spare me, Kain!');
  }
  return {difficulty, diceNumber, special};
}

function throwDices(difficulty, diceNumber, special) {
  const res = {
    values: [],
    one: 0,
    success: 0,
    task: `throwing ${diceNumber} dices with ${difficulty} difficulty`
  };
  if (special) {
    res.task += ' using speciality';
  }
  for (let i = 0; i < diceNumber; i++) {
    const val = randomDice();
    if (val === 1) {
      res.one++;
    }
    else if (val === 0) {
      if (special) {
        res.success += 2;
      }
      else
        res.success++;
    }
    else if (val >= difficulty) {
      res.success++;
    }
    res.values.push(val);
  }
  return res;
}

function parseResult(res) {
  const result = {success: res.success, values: res.values, task: res.task};
  if (result.success === 0 && res.one > 0) {
    result.msg = 'Botch!';
    return result;
  }
  result.success = result.success - res.one;
  if (result.success < 0) {
    result.success = 0;
  }
  if (result.success === 0) {
    result.msg = 'Fail!';
    return result;
  }
  if (result.success === 1) {
    result.msg = 'Success... Marginal.';
    return result;
  }
  if (result.success === 2) {
    result.msg = 'Success... Moderate.';
    return result;
  }
  if (result.success === 3) {
    result.msg = 'Success. Complete!';
    return result;
  }
  if (result.success === 4) {
    result.msg = 'Success. Exceptional!!';
    return result;
  }
  result.msg = 'Success!!! Phenomenal!!!';
  return result;
}

function resultToStr(res) {
  return `Task: ${res.task}\nResult: ${res.values.join(', ')}\nSuccesses: ${res.success}\nMessage: ${res.msg}`;
}

/*
const test = '5x8';
const params = parseRequest(test);
const res = throwDices(params.difficulty, params.diceNumber);
const reply = parseResult(res);
const resStr=resultToStr(reply);
console.log(resStr);
*/


bot.on('polling_error', (error) => {
  console.log("Polling error: " + error.code);  // => 'EFATAL'
  console.log(error);
});

bot.on('webhook_error', (error) => {
  console.log("Webhook error: " + error.code);  // => 'EPARSE'
});

// Matches "/echo [whatever]"
bot.onText(/\/start/, function (msg, match) {
  console.log('start');
  const chatId = msg.chat.id || msg.from.id;
  bot.sendMessage(chatId, 'Please enter message' +
    ' as "axb" where a is a number of dice and x' +
    ' is difficulty. You can also add keyword "spec"' +
    ' if it is speciality.');
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  if (!msg || msg.text === '/start') {
    return;
  }
  msg.text = msg.text.replace('/roll', '').trim();
  console.log('message');
  console.log(msg);
  const chatId = msg.chat.id || msg.from.id;
  let params;
  try {
    params = parseRequest(msg.text);
  }
  catch (e) {
    bot.sendMessage(chatId, e.toString());
    return;
  }
  const res = throwDices(params.difficulty, params.diceNumber, params.special);
  const reply = parseResult(res);
  const resStr = resultToStr(reply);
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, resStr);
});
