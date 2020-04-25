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
  const offersList = offers.map((offer) => `<li>${offer.title}</li>`).join(``);
  res.send(`<ul>${offersList}</ul>`);
});

module.exports = router;