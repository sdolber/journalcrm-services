const { gql, makeExecutableSchema } = require('apollo-server');
const { merge } = require('lodash');

const { 
activityTypeDef, 
activityResolvers,
} = require('./activity.js');

const { 
contactTypeDef, 
contactResolvers,
} = require('./contact.js');

const Query = gql`
    type Query {
        _empty: String
    }

    type Mutation {
        _empty: String
    }
`;

  
module.exports = makeExecutableSchema({
    typeDefs: [ Query, activityTypeDef, contactTypeDef ],
    resolvers: merge({}, activityResolvers, contactResolvers),
});