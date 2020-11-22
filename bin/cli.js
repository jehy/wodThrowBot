#!/usr/bin/env node

'use strict';

const debug = require('debug')('throwBot');
const {parseResult, resultToStr} = require('../lib/output');
const {parseRequest} = require('../lib/parseInput');
const {throwDices} = require('../lib/throw');

const msg = process.argv.slice(2).join(' ').trim();
debug.enabled = true;
debug(`message: ${msg}`);
let params;
try {
  params = parseRequest(msg);
}
catch (e) {
  debug(`ERROR: ${e.toString()}`);
  return;
}
const res = throwDices(params);
const reply = parseResult(res);
const resStr = resultToStr(reply);
debug(resStr);
