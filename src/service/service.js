'use strict';

const {Cli} = require(`./cli/index.js`);

const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
} = require(`../constants.js`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

console.log(userArguments);

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

if (userArguments.slice(1)) {
  const [count] = userArguments.slice(1);

  Cli[userCommand].run(count);
}
