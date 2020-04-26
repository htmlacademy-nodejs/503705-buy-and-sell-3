'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const {getLogger} = require(`../logger.js`);
const logger = getLogger();

const {
  ExitCode,
  COUNT_ERROR_MESSAGE,
  ID_SIZE,
} = require(`../../constants.js`);

const {
  getRandomInt,
  getRandomArr,
  readContent,
} = require(`../../utils`);

const FILE_NAME = `mock.json`;
const FILE_ERR_MESSAGE = `Can't write data to file...`;
const FILE_SUCCESS_MESSAGE = `Operation success. File created.`;
const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

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

const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const getComments = (comments) => {
  const commentsArray = getRandomArr(comments).slice();
  if (commentsArray.length) {
    return commentsArray.map((item, index) => {
      return item = {
        id: nanoid(ID_SIZE),
        comment: commentsArray[index]
      };
    });
  }
  return [];
};

const generateOffers = (count, titles, sentences, categories, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(ID_SIZE),
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    description: getRandomArr(sentences).join(` `),
    type: Object.keys(OfferType)[getRandomInt(0, Object.keys(OfferType).length - 1)],
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
    category: getRandomArr(categories),
    comments : getComments(comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(userCountOfAds) {
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const count = userCountOfAds;

    if (Number.parseInt(count, 10) > MAX_COUNT) {
      logger.error(COUNT_ERROR_MESSAGE);
      process.exit(ExitCode.error);
    }
    
    const countOfAds = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const fileContent = JSON.stringify(generateOffers(countOfAds, titles, sentences, categories, comments));

    try {
      await fs.writeFile(FILE_NAME, fileContent);
      logger.info(FILE_SUCCESS_MESSAGE);
    } catch (err) {
      logger.error(FILE_ERR_MESSAGE);
    }
  },
};
