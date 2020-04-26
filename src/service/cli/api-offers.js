'use strict';

const {Router} = require(`express`);
const router = new Router();
const fs = require(`fs`);
const FILE_NAME = `mock.json`;
const {readContent} = require(`../../utils.js`);
const {nanoid} = require(`nanoid`);
const {getLogger} = require(`../logger.js`);
const logger = getLogger();

const getData = (fileName) => {
  const fileContent = fs.readFileSync(fileName);
  return JSON.parse(fileContent);
};

const OFFERS = getData(FILE_NAME);
const NO_OFFER_MESSAGE = `Такого объявления мы не нашли, попробуйте еще раз.`;

const getOfferMarkup = (offer) => (
  `<h1>${offer.title}</h1>
  <p>Id объявления: ${offer.id}</p>
  <p><b>${offer.type}</b></p>
  <p>${offer.description}</p>
  <p>Цена: ${offer.sum} ₽</p>
  <p>${offer.category.join(` `)}</p>
  <p>Изображение: ${offer.picture}</p>
  <ul>
    ${offer.comments.map((item) => `<li>id: ${item.id}<p>${item.comment}</p></li>`).join(``)}
  </ul>`
);

const getCommentsMarkup = (offer) => (
  `<h1>Комментарии объявления «${offer.title}»</h1>
  <ol>
    ${offer.comments.map((item) => {
      return (`<li>id комментария: ${item.id}
                <p>${item.comment}</p>
              </li>`);
    }).join(``)}
  </ol>`
);

const getOffersListMarkup = (list) => {
  const offersList = list.map((offer) => 
    `<li>
      <p>Id объявления ${offer.id}</p>
      <p>Заголовок: ${offer.title}</p>
    </li>`)
    .join(``);
  return `<ul>${offersList}</ul>`;
};

router.get(`/offers`, (req, res) => {
  logger.debug(`Запрос ${req.method} к странице /api${req.url}...`);
  res.send(getOffersListMarkup(OFFERS));
  logger.error(`Запрос ${req.method} к странице /api${req.url} выполнен.`);
  logger.info(`Статус-код ответа ${res.statusCode}`)
});

router.post(`/offers`, (req, res) => {
  logger.debug(`Запрос ${req.method} к странице /api/${req.url}...`)
  if (req.body.title && req.body.type && req.body.sum && req.body.category && req.body.picture) {
    const newOffer = {
      id: nanoid(),
      title: req.body.title,
      type: req.body.type,
      sum: req.body.sum,
      category: req.body.category.split(`, `).map((item) => item.trim()),
      picture: req.body.picture,
      comments: [],
    }
  
    OFFERS.push(newOffer);
    logger.error(`Объявление успешно создано.`);
    logger.info(` Статус-код ответа ${res.statusCode}`)
    return res.send(getOfferMarkup(newOffer));
  }
  logger.error(`Не заполнены все поля.`);
  logger.info(`Статус-код ответа 400`);
  return res.status(400).send(`Нужно заполнить все поля.`);
});

router.get(`/offers/:offerId`, (req, res) => {
  logger.debug(`Запрос ${req.method} к странице /api${req.url}...`)
  const offerId = req.params.offerId;
  const offer = OFFERS.find((item) => offerId === item.id);
  if (offer) {
    logger.error(`Запрос ${req.method} к странице /api${req.url} успешно выполнен`);
    logger.info(`Статус-код ответа ${res.statusCode}`);
    return res.send(getOfferMarkup(offer));
  }
  logger.error(`Запрос ${req.method} к странице /api${req.url} не выполнен. Неверный id.`);
  logger.info(`Статус-код ответа 404`);
  return res.status(404).send(NO_OFFER_MESSAGE);
});

router.put(`/offers/:offerId`, (req, res) => {
  logger.debug(`Запрос ${req.method} к странице /api${req.url}...`);
  const offerId = req.params.offerId;
  const offer = OFFERS.find((item) => offerId === item.id);
  if (req.body.title && req.body.description && req.body.sum && req.body.category && req.body.picture) {
    offer.id = offerId;
    offer.title = req.body.title;
    offer.description = req.body.description;
    offer.sum = req.body.sum;
    offer.category = req.body.category.split(`, `).map((item) => item.trim());
    offer.picture = req.body.picture;

    logger.error(`Изменения сохранены`);
    logger.info(`Статус-код ответа ${res.statusCode}`);
    return res.send(getOfferMarkup(offer));
  }
  logger.error(`Изменения не сохранены. Не заполнены все поля.`);
  logger.info(`Статус-код ответа 400`);
  return res.status(400).send(`Нужно заполнить все поля.`);
});

router.delete(`/offers/:offerId`, (req, res) => {
  logger.debug(`Запрос ${req.method} к странице /api${req.url}...`);
  const offerId = req.params.offerId;
  const offer = OFFERS.find((item) => offerId === item.id);
  if (offer) {
    OFFERS.splice(OFFERS.indexOf(offer), 1);
    logger.error(`Объявление успешно удалено.`);
    logger.info(`Статус-код ответа ${res.statusCode}`);
    return res.send(`Объявление удалено.`);
  }
  logger.error(`Такого объявления нет.`);
  logger.info(`Статус-код ответа 404`);
  return res.status(404).send(NO_OFFER_MESSAGE);
});

router.get(`/categories`, async (req, res) => {
  logger.debug(`Запрос ${req.method} к странице /api${req.url}...`);
  const categories = await readContent(`./data/categories.txt`);

  const categoriesMarkup = categories.map((category) => `<li>${category}</li>`).join(``);
  
  res.send(`<ul>${categoriesMarkup}</ul>`);
  logger.error(`Запрос ${req.method} к странице /api${req.url} успешно выполен.`);
  logger.info(`Статус-код ответа ${res.statusCode}`);
});

router.get(`/offers/:offerId/comments`, (req, res) => {
  logger.debug(`Запрос ${req.method} к странице /api${req.url}...`);
  const offerId = req.params.offerId;
  const offer = OFFERS.find((item) => offerId === item.id);
  if(offer) {
    logger.error(`Запрос ${req.method} к странице /api${req.url} успешно выполнен.`);
    logger.info(`Статус-код ответа ${res.statusCode}`);
    return res.send(getCommentsMarkup(offer));
  }
  logger.error(`Запрос ${req.method} к странице /api${req.url} не выполнен. Такой страницы нет.`);
  logger.info(`Статус-код ответа 404`);
  return res.status(404).send(NO_OFFER_MESSAGE);
});

router.post(`/offers/:offerId/comments`, (req, res) => {
  logger.debug(`Запрос ${req.method} к странице /api${req.url}...`);
  if (!req.body) {
    logger.error(`Ошибка при создании комментария.`);
    logger.info(`Статус-код ответа 400`);
    return res.status(400).send(`Ошибка при создании комментария. Заполните все поля.`);
  }
  const offerId = req.params.offerId;
  const offer = OFFERS.find((item) => offerId === item.id);
  if (offer) {
    if (req.body.comment) {
      const newComment = {
        id: nanoid(),
        comment: req.body.comment
      };
      offer.comments.push(newComment);
      logger.error(`Комментарий успешно создан`);
      logger.info(`Статус-код ответа ${res.statusCode}`);
      return res.send(getCommentsMarkup(offer));
    }
    logger.error(`Ошибка при создании комментария. Нет текста комментария.`);
    logger.info(`Статус-код ответа 400`);
    return res.status(400).send(`Напишите текст комментария.`);
  }
  logger.error(`Такого объявления нет. Неверный id.`);
  logger.info(`Статус-код ответа 404`);
  return res.status(404).send(NO_OFFER_MESSAGE);
});

router.delete(`/offers/:offerId/comments/:commentId`, (req, res) => {
  logger.debug(`Запрос ${req.method} к странице /api${req.url}...`);
  const offerId = req.params.offerId;
  const offer = OFFERS.find((item) => offerId === item.id);
  if (offer) {
    const commentId = req.params.commentId;
    const comment = offer.comments.find((item) => commentId === item.id);
    if (comment) {
      offer.comments.splice(offer.comments.indexOf(comment), 1);
      logger.error(`Комментарий успешно удален.`);
      logger.info(`Статус-код ответа ${res.statusCode}`);
      return res.send(`Комментарий удален.`);
    }
    logger.error(`Такого комментария нет. Неверный id.`);
    logger.info(`Статус-код ответа 404`);
    return res.statusCode(404).send(`Нет такого комментария у этого объявления. Поищите другой.`);
  }
  logger.error(`Такого объявления нет. Неверный id.`);
  logger.info(`Статус-код ответа 404`);
  return res.statusCode(404).send(NO_OFFER_MESSAGE);
});

router.get(`/search`, (req, res) => {
  logger.debug(`Запрос ${req.method} к странице ${req.url}...`);
  if (req.query.query) {
    const queryString = req.query.query.toLowerCase();
    let matchingOffers = [];
    OFFERS.forEach((offer) => {
      if (offer.title.toLowerCase().indexOf(queryString) >= 0) {
        matchingOffers.push(offer);
      }
    });
    if (matchingOffers.length) {
      let postsString = `публикация`;
      const postsAmount = matchingOffers.length;
      if (postsAmount > 4 && postsAmount < 20) {
        postsString = `публикаций`;
      } else if (postsAmount.toString().search(/[234]$/) >= 0) {
        postsString = `публикации`;
      } else {
        postsString = `публикаций`;
      }
      logger.error(`Запрос ${req.method} к странице /api${res.url} успешно выполнен.`);
      logger.info(`Статус-код ответа ${res.statusCode}`);
      return res.send(
        `<h1>Найдено ${postsAmount} ${postsString}</h1>` + 
        getOffersListMarkup(matchingOffers)
        );
    }
    logger.error(`Запрос ${req.method} к странице /api${req.url} успешно выполнен. Ничего не найдено.`);
    logger.info(`Статус-код ответа 404`);
    return res.status(404).send(`Не найдено ни одной публикации.`);
  }
  logger.error(`Запрос ${res.method} по пустой строке не может быть выполнен.`);
  logger.info(`Статус-код ответа 400`);
  return res.status(400).send(`Введите в строку поиска слово.`);
});


module.exports = router;