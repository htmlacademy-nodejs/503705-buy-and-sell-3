'use strict';

const fs = require(`fs`).promises;
const logger = require(`pino`)();

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  let shuffledArray = someArray.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [shuffledArray[i], shuffledArray[randomPosition]] = [shuffledArray[randomPosition], shuffledArray[i]];
  }
  return shuffledArray;
};

const getRandomArr = (someArray) => {
  let randomArray = someArray.slice();
  const maxIndex = getRandomInt(1, randomArray.length - 1);
  return shuffle(randomArray).slice(0, maxIndex);
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    logger.error(err);
    return[];
  }
};

module.exports = {
  getRandomInt,
  getRandomArr,
  readContent,
};
