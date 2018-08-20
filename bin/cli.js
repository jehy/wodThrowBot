#!/usr/bin/env node

'use strict';

const debug = require('debug')('throwBot');
const utils = require('../utils');

const msg = process.argv.slice(2).join(' ').trim();
debug.enabled = true;
debug(`message: ${msg}`);
let params;
try {
  params = utils.parseRequest(msg);
}
catch (e) {
  debug(`ERROR: ${e.toString()}`);
  return;
}
const res = utils.throwDices(params);
const reply = utils.parseResult(res);
const resStr = utils.resultToStr(reply);
debug(resStr);
