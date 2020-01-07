const accounts = require('express').Router();
const processAccount = require('./processAccount');

accounts.post('/processAccount', processAccount);

module.exports = accounts;