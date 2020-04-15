'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const express = require(`express`);
const {HttpCode} = require(`../../constants.js`);

const DEFAULT_PORT = 3000;
const FILE_NAME = `mock.json`;
const ERROR_MESSAGE = `Ошибка при создании сервера`;
const SUCCESS_MESSAGE = `Ожидаю соединений на порт `;

const app = express();

app.use(express.json());

app.get(`/offers`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(error);
  }
});

app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const customPort = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (error) => {
      if (error) {
        return console.error(chalk.red(ERROR_MESSAGE));
      }

      return console.info(chalk.green(SUCCESS_MESSAGE));
    });
  },
};