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

app.post('/parseActivity', async (req, res) => {
  let msg = req.body.message;
  let result = await parseActivity(msg); 
  res.status(200).send(result);
});

app.post('/parseSyntax', async (req, res) => {
  let msg = req.body.message;
  
  const lsClient = new language.LanguageServiceClient();

  const document = {
    content: msg,
    type: 'PLAIN_TEXT',
  };

  // Detects entities in the document
  const [tokens] = await lsClient.analyzeSyntax({document});

  res.status(200).send(tokens);
});

app.post('/parseEntities', async (req, res) => {
  let msg = req.body.message;
  
  const lsClient = new language.LanguageServiceClient();

  const document = {
    content: msg,
    type: 'PLAIN_TEXT',
  };

  // Detects entities in the document
  const [tokens] = await lsClient.analyzeEntitySentiment({document});

  res.status(200).send(tokens);
});

exports.app = functions.https.onRequest(app);