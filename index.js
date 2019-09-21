const chrono = require('chrono-node');
const language = require('@google-cloud/language');
const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser')();
const validateFirebaseIdToken = require('./firebaseAuth');
const cors = require('cors')({
  credentials: true,
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
});
const app = express();

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);

app.post('/parseTime', (req, res) => {
  let message = req.body.message;
  let result = chrono.parse(message); 
  res.status(200).send(result);
});

app.post('/parseEntities', async (req, res) => {
  let message = req.body.message;
  const client = new language.LanguageServiceClient();
  const document = {
    content: message,
    type: 'PLAIN_TEXT',
  };

  // Detects entities in the document
  const [result] = await client.analyzeEntitySentiment({document});
  const entities = result.entities;

  res.status(200).send(entities);
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);

