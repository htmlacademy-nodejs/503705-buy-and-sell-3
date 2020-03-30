'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  ExitCode,
  COUNT_ERROR_MESSAGE,
} = require(`../../constants.js`);

const {
  getRandomInt,
  getRandomArr,
} = require(`../../utils`);

const FILE_NAME = `mock.json`;
const FILE_ERR_MESSAGE = `Can't write data to file...`;
const FILE_SUCCESS_MESSAGE = `Operation success. File created.`;
const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;

const OfferType = {
  offer: `offer`,
  sale: `sale`,
};

const PictureRestrict = {
  min: 1,
  max: 16,
};

const SumRestrict = {
  min: 1000,
  max: 100000,
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return[];
  }
};

const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const generateOffers = (count, titles, sentences, categories) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    description: getRandomArr(sentences),
    type: Object.keys(OfferType)[getRandomInt(0, Object.keys(OfferType).length - 1)],
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
    category: getRandomArr(categories),
  }))
);

module.exports = {
  name: `--generate`,
  async run(userCountOfAds) {
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const count = userCountOfAds;

    if (Number.parseInt(count, 10) > MAX_COUNT) {
      console.error(chalk.red(COUNT_ERROR_MESSAGE));
      process.exit(ExitCode.error);
    }
    
    const countOfAds = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const fileContent = JSON.stringify(generateOffers(countOfAds, titles, sentences, categories));

    try {
      await fs.writeFile(FILE_NAME, fileContent);
      console.log(chalk.green(FILE_SUCCESS_MESSAGE));
    } catch (err) {
      console.error(chalk.red(FILE_ERR_MESSAGE));
    }
  },
};
