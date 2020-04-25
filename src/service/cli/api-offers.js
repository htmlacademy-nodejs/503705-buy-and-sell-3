'use strict';

const {Router} = require(`express`);
const router = new Router();
const fs = require(`fs`).promises;
const FILE_NAME = `mock.json`;

const getData = async (fileName) => {
  const fileContent = await fs.readFile(fileName);
  return JSON.parse(fileContent);
};

router.get(`/offers`, async (req, res) => {
  const offers = await getData(FILE_NAME);
  const offersList = offers.map((offer) => 
    `<li>
      <p>Id объявления ${offer.id}</p>
      <p>Заголовок: ${offer.title}</p>
    </li>`)
    .join(``);
  res.send(`<ul>${offersList}</ul>`);
});

router.get(`/offers/:offerId`, async (req, res) => {
  const offerId = req.params.offerId;
  const offers = await getData(FILE_NAME);
  const offer = offers.find((item) => {
    return offerId === item.id;
  });
  res.send(`
    <h1>${offer.title}</h1>
    <p>Id объявления: ${offer.id}</p>
    <p><b>${offer.type}</b></p>
    <p>${offer.description}</p>
    <p>Цена: ${offer.sum} ₽</p>
    <p>${offer.category.join(` `)}</p>
    <ul>
      ${offer.comments.map((item) => `<li>id: ${item.id}<p>${item.comment}</p></li>`).join(``)}
    </ul>
  `);
});

module.exports = router;