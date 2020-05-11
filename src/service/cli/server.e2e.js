'use strict';

const express = require(`express`);
const apiRoutes = require(`./api-offers.js`);

const server = express();

server.use(express.json());
server.use(`/api`, apiRoutes);
server.use((req, res) => res.status(404).send({ok: false}));

module.exports = server;