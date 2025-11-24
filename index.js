'use strict';

const TelegramBot = require('node-telegram-bot-api');
const config = require('config');
const debug = require('debug')('throwBot');

const {parseResult, resultToStr} = require('./lib/output');
const {parseRequest} = require('./lib/parseInput');
const {throwDices} = require('./lib/throw');

// replace the value below with the Telegram token you receive from @BotFather
const {token} = config.telegram;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

async function delay(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

bot.on('polling_error', (error) => {
  debug('Polling error', error.message);  // => 'EFATAL'
  debug(error);
});

bot.on('webhook_error', (error) => {
  debug('Webhook error', error.message);  // => 'EPARSE'
});

// Matches "/echo [whatever]"
bot.onText(/\/start/, async (msg) => {
  debug('start message from user');
  const chatId = msg.chat.id || msg.from.id;
  try {
    await bot.sendMessage(chatId, 'Please enter message'
    + ' as "axb" where a is a number of dice and b'
    + ' is difficulty. You can also add keyword "spec"'
    + ' if it is speciality or "damage" if it is damage.', {
      reply_markup: JSON.stringify({
        remove_keyboard: true,
      }),
    });
  } catch (err) {
    debug(`Failed to send start message to user: ${err.message}`);
  }
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

function processMessage(command, userName) {
  const params = parseRequest(command);
  const res = throwDices(params);
  const reply = parseResult(params, res);
  return {text: resultToStr(reply, userName), task: params.task};
}

bot.on('inline_query', async (msg)=>{
  debug(`inline message from user: ${JSON.stringify(msg)}`);
  if (!msg || !msg.query) {
    debug('Empty or start message ignoring');
    return;
  }
  const chatId =  msg.from.id;
  const command = messageToCommand(msg, true);
  if (!command) {
    return;
  }
  let res;
  try {
    res = processMessage(command, msg.from.username);
  }
  catch (e) {
    await bot.sendMessage(chatId, e.toString()).catch((err)=>debug(`failed to send error to user: ${err}`));
    debug(e);
    return;
  }
  if (!res) {
    return;
  }
  const inlineQueryResult = {
    type: 'article',
    id: '1',
    title: 'Throw dice',
    description: res.task,
    input_message_content: {message_text: res.text},
  };
  await bot.answerInlineQuery(msg.id, [inlineQueryResult], {cache_time: 0})
    .catch((err)=>debug(`failed to send inline result to user: ${err}`));
});

bot.on('message', async (msg)=>{

  debug(`message from user: ${JSON.stringify(msg)}`);
  if (!msg || !msg.text || msg.text === '/start') {
    debug('Empty or start message ignoring');
    return;
  }
  const command = messageToCommand(msg);
  if (!command) {
    return;
  }
  const chatId = msg.chat.id || msg.from.id;
  let res;
  try {
    res = processMessage(command, msg.from.username);
  }
  catch (e) {
    await bot.sendMessage(chatId, e.toString()).catch((err)=>debug(`failed to send error to user: ${err}`));
    debug(e.message);
    return;
  }
  if (!res) {
    return;
  }
  await delay(200);
  await bot.sendChatAction(chatId, 'typing').catch((err)=>debug(`failed to send typing to user: ${err}`));
  await delay(2000);
  try {
    await bot.sendMessage(chatId, res.text);
  } catch (err) {
    debug(`Failed to send message to user: ${err.message}`);
  }
});
