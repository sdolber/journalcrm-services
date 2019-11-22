const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser')();
const validateFirebaseIdToken = require('./firebaseAuth');
const parseActivity = require('./logic/activityParser');
const language = require('@google-cloud/language');
const cors = require('cors')({
  credentials: true,
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
});
const app = express();
const routes = require('./routes');

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);

app.use('/', routes);

exports.app = functions.https.onRequest(app);