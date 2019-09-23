const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser')();
const validateFirebaseIdToken = require('./firebaseAuth');
const parseActivity = require('./activityParser');
const cors = require('cors')({
  credentials: true,
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
});
const app = express();

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);

app.post('/parseActivity', async (req, res) => {
  let msg = req.body.message;
  let result = await parseActivity(msg); 
  res.status(200).send(result);
});

exports.app = functions.https.onRequest(app);