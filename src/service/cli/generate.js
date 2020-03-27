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

const TITLES = [
  `Продам книги Стивена Кинга.`,
  `Продам новую приставку Sony Playstation 5.`,
  `Продам отличную подборку фильмов на VHS.`,
  `Куплю антиквариат.`,
  `Куплю породистого кота.`,
  `Продам коллекцию журналов «Огонёк».`,
  `Отдам в хорошие руки подшивку «Мурзилка».`,
  `Продам советскую посуду. Почти не разбита.`,
  `Куплю детские санки.`
];

const SENTENCES = [
  `Товар в отличном состоянии.`,
  `Пользовались бережно и только по большим праздникам.`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары.`,
  `Даю недельную гарантию.`,
  `Если товар не понравится — верну всё до последней копейки.`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `Две страницы заляпаны свежим кофе.`,
  `При покупке с меня бесплатная доставка в черте города.`,
  `Кажется, что это хрупкая вещь.`,
  `Мой дед не мог её сломать.`,
  `Кому нужен этот новый телефон, если тут такое...`,
  `Не пытайтесь торговаться. Цену вещам я знаю.`
];

const CATEGORIES = [
  `Книги`,
  `Разное`,
  `Посуда`,
  `Игры`,
  `Животные`,
  `Журналы`,
];

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

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    description: getRandomArr(SENTENCES),
    type: Object.keys(OfferType)[getRandomInt(0, Object.keys(OfferType).length - 1)],
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
    category: getRandomArr(CATEGORIES),
  }))
);

module.exports = {
  name: `--generate`,
  async run(userCountOfAds) {
    const count = userCountOfAds;

    if (Number.parseInt(count, 10) > MAX_COUNT) {
      console.error(chalk.red(COUNT_ERROR_MESSAGE));
      process.exit(ExitCode.error);
    }
    
    const countOfAds = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const fileContent = JSON.stringify(generateOffers(countOfAds));

    try {
      await fs.writeFile(FILE_NAME, fileContent);
      console.log(chalk.green(FILE_SUCCESS_MESSAGE));
    } catch (err) {
      console.error(chalk.red(FILE_ERR_MESSAGE));
    }
  },
};
