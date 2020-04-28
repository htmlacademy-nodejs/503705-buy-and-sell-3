'use strict';

const {Router} = require(`express`);
const router = new Router();
const fs = require(`fs`);
const chalk = require(`chalk`);
const FILE_NAME = `mock.json`;
const {readContent} = require(`../../utils.js`);
const {nanoid} = require(`nanoid`);

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
  <h2>Комментарии:</h2>
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
  return (
    `<h1>Список объявлений</h1>
    <ul>${offersList}</ul>`
  );
};

const getPage = (title, content) => (
  `<!Doctype html>
  <html lang="ru">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
    </head>
    <body>
      ${content}
    </body>
  </html>`
);

router.get(`/offers`, (req, res) => {
  const offersMarkup = getOffersListMarkup(OFFERS);
  const title = `Список объявлений`;
  res.send(getPage(title, offersMarkup));
});

router.post(`/offers`, (req, res) => {
  if (!req.body.title || !req.body.type || !req.body.sum || !req.body.category || !req.body.picture) {
    return res.statusCode(400).send(`Нужно заполнить все поля.`);
  }
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
  console.log(chalk.green(`Объявление успешно создано.`));
  return res.send(getOfferMarkup(newOffer));
});

router.get(`/offers/:offerId`, (req, res) => {
  const offerId = req.params.offerId;
  const offer = OFFERS.find((item) => offerId === item.id);
  if (offer) {
    const offerMarkup = getOfferMarkup(offer);
    return res.send(getPage(offer.title, offerMarkup));
  }
  return res.statusCode(404).send(NO_OFFER_MESSAGE);
});

router.put(`/offers/:offerId`, (req, res) => {
  const offerId = req.params.offerId;
  const offer = OFFERS.find((item) => offerId === item.id);
  offer.title = req.body.title;
  offer.description = req.body.description;
  offer.sum = req.body.sum;
  offer.category = req.body.category.split(`, `).map((item) => item.trim());
  offer.picture = req.body.picture;
  
  console.log(chalk.green(`Изменения сохранены`));
  res.send(getOfferMarkup(offer));
});

router.delete(`/offers/:offerId`, (req, res) => {
  const offerId = req.params.offerId;
  const offer = OFFERS.find((item) => offerId === item.id);
  if (offer) {
    OFFERS.splice(OFFERS.indexOf(offer), 1);
    return res.send(`Объявление удалено.`);
  }
  return res.statusCode(404).send(NO_OFFER_MESSAGE);
});

router.get(`/categories`, async (req, res) => {
  const categories = await readContent(`./data/categories.txt`);

  const categoriesMarkup = categories.map((category) => `<li>${category}</li>`).join(``);
  
  res.send(`<ul>${categoriesMarkup}</ul>`);
});

router.get(`/offers/:offerId/comments`, (req, res) => {
  const offerId = req.params.offerId;
  const offer = OFFERS.find((item) => offerId === item.id);
  if(offer) {
    return res.send(getCommentsMarkup(offer));
  }
  return res.statusCode(404).send(NO_OFFER_MESSAGE);
});

router.post(`/offers/:offerId/comments`, (req, res) => {
  if (!req.body) {
    return res.statusCode(400).send(`Ошибка при создании комментария.`);
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
      console.log(chalk.green(`Комментарий успешно создан`));
      return res.send(getCommentsMarkup(offer));
    }
    return res.statusCode(400).send(`Напишите текст комментария.`);
  }
  return res.statusCode(404).send(NO_OFFER_MESSAGE);
});

router.delete(`/offers/:offerId/comments/:commentId`, (req, res) => {
  const offerId = req.params.offerId;
  const offer = OFFERS.find((item) => offerId === item.id);
  if (offer) {
    const commentId = req.params.commentId;
    const comment = offer.comments.find((item) => commentId === item.id);
    if (comment) {
      offer.comments.splice(offer.comments.indexOf(comment), 1);
      return res.send(`Комментарий удален.`);
    }
    return res.statusCode(404).send(`Нет такого комментария у этого объявления. Поищите другой.`);
  }
  return res.statusCode(404).send(NO_OFFER_MESSAGE);
});

router.get(`/search`, (req, res) => {
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
      return res.send(
        `<h1>Найдено ${postsAmount} ${postsString}</h1>` + 
        getOffersListMarkup(matchingOffers)
        );
    }
    return res.statusCode(404).send(`Не найдено ни одной публикации.`);
  }
  return res.statusCode(400).send(`Введите в строку поиска слово.`);
});


module.exports = router;