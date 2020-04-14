'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/:id`, (req, res) => res.send(`/offers/${req.params.id}`));
offersRouter.get(`/add`, (req, res) => res.send(`/offers/add`));
offersRouter.get(`/edit/:id`, (req, res) => res.send(`/offers/edit/${req.params.id}`));
offersRouter.get(`/category/:id`, (req, res) => res.send(`/offers/category/${req.params.id}`));

module.exports = offersRouter;