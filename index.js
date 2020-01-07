const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser')();
const validateFirebaseIdToken = require('./firebaseAuth');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors')({
  credentials: true,
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
});
const app = express();
const routes = require('./routes');
const schema = require('./schema/schema');
const { createStore } = require('./utils');

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);

const ActivityAPI = require('./datasources/Activity');

const store = createStore();

const server = new ApolloServer({ 
    schema,  dataSources: () => ({
      activityAPI: new ActivityAPI({ store })
    })
 });

server.applyMiddleware({ app, path: '/graphql' });

app.use('/api', routes);

exports.app = functions.https.onRequest(app);