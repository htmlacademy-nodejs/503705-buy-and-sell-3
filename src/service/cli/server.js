'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const http = require(`http`);
const {HttpCode} = require(`../../constants.js`);

const DEFAULT_PORT = 3000;
const FILE_NAME = `mock.json`;
const ERROR_MESSAGE = `Ошибка при создании сервера`;
const SUCCESS_MESSAGE = `Ожидаю соединений на порт `;

const sendResponce = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
        <head>
          <title>Hello from Node</title>
        </head>
        <body>${message}</body>
      </html>`.trim();
  
  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILE_NAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponce(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponce(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
    break;

    default:
      sendResponce(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const customPort = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          return console.error(chalk.red(ERROR_MESSAGE), err);
        }

        return console.info(chalk.green(SUCCESS_MESSAGE + port));
      });
  },
};