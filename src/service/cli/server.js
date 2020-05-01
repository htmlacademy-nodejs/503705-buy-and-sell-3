'use strict';

const fs = require(`fs`).promises;
const express = require(`express`);
const {HttpCode} = require(`../../constants.js`);
const apiOffers = require(`./api-offers.js`);
const {getLogger} = require(`../logger.js`);
const logger = getLogger();

const DEFAULT_PORT = 3000;
const FILE_NAME = `mock.json`;
const ERROR_MESSAGE = `Ошибка при создании сервера`;
const SUCCESS_MESSAGE = `Ожидаю соединений на порт `;

const app = express();

app.use(express.json());
app.use(`/api`, apiOffers);

app.get(`/offers`, async (req, res) => {
  logger.debug(`Запрос get к странице /offers...`)
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(error);
  }
  logger.error(`Запрос get к странице /offers выполнен.`);
  logger.info(`Статус-код ответа ${res.statusCode}`)
});

app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));
app.use((err, req, res, next) => {
  if (err.message === `Обработчик ошибок сработал`) {
    res.status(500).send(`Какая-нибудь херня`);
  }
  logger.error(`Обработчик ошибок сработал`);
  res.status(500).send(err.message);
  next();
});

module.exports = {
  name: `server`,
  run(args) {
    const customPort = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (error) => {
      if (error) {
        console.log(ERROR_MESSAGE);
        return logger.error(ERROR_MESSAGE);
      }
      console.log(SUCCESS_MESSAGE + `${port}`);
      return logger.info(SUCCESS_MESSAGE + `${port}`);
    });
  },
};
