const routes = require('express').Router();
const activities = require('./activities');

routes.use('/activities', activities);

module.exports = routes;
