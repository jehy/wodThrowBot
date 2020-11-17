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
bot.onText(/\/start/, async (msg) => {
  debug('start message from user');
  const chatId = msg.chat.id || msg.from.id;
  await bot.sendMessage(chatId, 'Please enter message'
    + ' as "axb" where a is a number of dice and b'
    + ' is difficulty. You can also add keyword "spec"'
    + ' if it is speciality or "damage" if it is damage.', {
    reply_markup: JSON.stringify({
      remove_keyboard: true,
    }),
  });
});

// Listen for any kind of message. There are different kinds of
// messages.

const messageFromGroup = ['/roll', '/roll@WodThrowBot', '/хуйни', '/хуйни@WodThrowBot', '/кшдд', '/кшдд@WodThrowBot'];

function messageToCommand(msg, inline = false)
{
  const query = inline ? msg.query : msg.text;
  if (inline || msg.chat.type === 'private')
  {
    return messageFromGroup.reduce((res, item) => res.replace(item, ''), query)
      .toLowerCase()
      .trim();
  }
  // group chat
  const isOur = messageFromGroup.some((key)=>query && query.includes(key));
  if (!isOur)
  {
    debug('not for us, ignoring');
    return false;
  }
  return messageFromGroup.reduce((res, item) => res.replace(item, ''), query)
    .toLowerCase()
    .trim();

}

async function processMessage(command, userName) {
  const params = utils.parseRequest(command);
  const res = utils.throwDices(params);
  const reply = utils.parseResult(res);
  return utils.resultToStr(reply, userName);
}

bot.on('inline_query', async (msg)=>{
  debug(`inline message from user: ${JSON.stringify(msg)}`);
  if (!msg || !msg.query) {
    debug('Empty or start message ignoring');
    return;
  }
  const chatId =  msg.from.id;
  const command = messageToCommand(msg, true);
  let res;
  try {
    res = await processMessage(command, msg.from.username);
  }
  catch (e) {
    await bot.sendMessage(chatId, e.toString());
    return;
  }
  if (!res) {
    return;
  }
  const inlineQueryResult = {
    type: 'article',
    id: '1',
    title: 'Throw dice',
    description: command,
    input_message_content: {message_text: res},
  };
  await bot.answerInlineQuery(msg.id, [inlineQueryResult]);
});

bot.on('message', async (msg)=>{

  debug(`message from user: ${JSON.stringify(msg)}`);
  if (!msg || !msg.text || msg.text === '/start') {
    debug('Empty or start message ignoring');
    return;
  }
  const command = messageToCommand(msg);
  const chatId = msg.chat.id || msg.from.id;
  let res;
  try {
    res = await processMessage(command, msg.from.username);
  }
  catch (e) {
    await bot.sendMessage(chatId, e.toString());
    return;
  }
  if (!res) {
    return;
  }
  await Promise.delay(200);
  await bot.sendChatAction(chatId, 'typing');
  await Promise.delay(2000);
  await bot.sendMessage(chatId, res);
});
