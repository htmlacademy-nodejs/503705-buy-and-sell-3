'use strict';

const version = require(`./version`);
const help = require(`./help`);

const Cli = {
  [version.name]: version,
  [help.name]: help,
};

module.exports = {
  Cli,
};
