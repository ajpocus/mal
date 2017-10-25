const ffi = require('ffi');
const fs = require('fs');
const path = require('path');

const RL_LIB = 'libedit';
const HISTORY_FILE = path.join(process.env.HOME, '.mal-history');

let rllib = ffi.Library(RL_LIB, {
  'readline': [ 'string', [ 'string' ] ],
  'add_history': [ 'int', [ 'string' ] ]
});

let rlHistoryLoaded = false;

async function readline(prompt) {
  prompt = prompt || 'user> ';

  if (!rlHistoryLoaded) {
    rlHistoryLoaded = true;

    let lines = [];
    let fileExists = await fs.exists(HISTORY_FILE);
    if (fileExists) {
      let content = await fs.readFile(HISTORY_FILE);
      lines = content.toString().split("\n");
    }

    lines = lines.slice(Math.max(lines.length - 2000, 0));
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]) {
        rllib.add_history(lines[i]);
      }
    }
  }

  let line = rllib.readline(prompt);
  try {
    await fs.appendFile(HISTORY_FILE, line + "\n");
  } catch (err) {
    console.log(err);
  }

  return line;
};

exports = module.exports = { readline };
