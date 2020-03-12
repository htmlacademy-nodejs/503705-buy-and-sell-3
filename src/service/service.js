'use strict';

const {Cli} = require(`./cli`);

const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MAX_COUNT_OF_ADS,
  COUNT_ERROR_MESSAGE,
  ExitCode
} = require(`../constants.js`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

if (userArguments.slice(1)) {
  const [userCountOfAds] = userArguments.slice(1);
  if (Number.parseInt(userCountOfAds, 10) > MAX_COUNT_OF_ADS) {
    console.log(COUNT_ERROR_MESSAGE);
    process.exit(ExitCode.error);
  }

  Cli[userCommand].run(userCountOfAds);
}
