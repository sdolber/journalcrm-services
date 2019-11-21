const activities = require('express').Router();
const parseActivity = require('./parseActivity');
const parseEntities = require('./parseEntities');
const parseSyntax = require('./parseSyntax');

activities.post('/parseActivity', parseActivity);
activities.post('/parseEntities', parseEntities);
activities.post('/parseSyntax', parseSyntax);

module.exports = activities;