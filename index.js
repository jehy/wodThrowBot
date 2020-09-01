'use strict';

const TelegramBot = require('node-telegram-bot-api');
const config = require('config');
const debug = require('debug')('throwBot');
const Promise = require('bluebird');


const utils = require('./utils');

// replace the value below with the Telegram token you receive from @BotFather
const {token} = config.telegram;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.on('polling_error', (error) => {
  debug('Polling error', error);  // => 'EFATAL'
  debug(error);
});

bot.on('webhook_error', (error) => {
  debug('Webhook error', error);  // => 'EPARSE'
});

// Matches "/echo [whatever]"
bot.onText(/\/start/, (msg) => {
  debug('start message from user');
  const chatId = msg.chat.id || msg.from.id;
  bot.sendMessage(chatId, 'Please enter message'
    + ' as "axb" where a is a number of dice and b'
    + ' is difficulty. You can also add keyword "spec"'
    + ' if it is speciality or "damage" if it is damage.');
});

// Listen for any kind of message. There are different kinds of
// messages.


const messageFromGroup = ['/roll', '/roll@WodThrowBot', '/хуйни', '/хуйни@WodThrowBot', '/кшдд', '/кшдд@WodThrowBot'];
bot.on('message', (msg) => {
  debug(`message from user: ${JSON.stringify(msg)}`);
  if (!msg || msg.text === '/start') {
    debug('Empty or start message ignoring');
    return;
  }

  let command;
  if (msg.chat.type !== 'private') // group chat
  {
    const isOur = messageFromGroup.some(key=>msg.text && msg.text.includes(key));
    if (!isOur)
    {
      debug('not for us, ignoring');
      return;
    }
    command = messageFromGroup.reduce((res, item) => res.replace(item, ''), msg.text)
      .toLowerCase()
      .trim();
  }
  else // personal chat
  {
    command = messageFromGroup.reduce((res, item) => res.replace(item, ''), msg.text)
      .toLowerCase()
      .trim();
  }
  const chatId = msg.chat.id || msg.from.id;
  let params;
  try {
    params = utils.parseRequest(command);
  }
  catch (e) {
    bot.sendMessage(chatId, e.toString());
    return;
  }
  const res = utils.throwDices(params);
  const reply = utils.parseResult(res);
  const resStr = utils.resultToStr(reply, msg.from.username);
  Promise.delay(200)
    .then(() => bot.sendChatAction(chatId, 'typing'))
    .then(() => Promise.delay(2000))
    .then(() => bot.sendMessage(chatId, resStr));
});
