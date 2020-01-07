const routes = require('express').Router();
const activities = require('./activities');
const accounts = require('./accounts');

routes.use('/activities', activities);
routes.use('/accounts', accounts);

module.exports = routes;
