const { gql } = require('apollo-server');

const activityTypeDef = gql`
    extend type Query {
        activity(id: String!): Activity
    }

    extend type Mutation {
        processActivity(text: String!): Activity
    }   

    type Activity {
        id: String!
        type: String!
        organization: String
        contacts: [Contact]
        sentiment: String
        content: String
    }
`;

const activityResolvers = {
  Query: {
    activity: () => {  },
  },
  Mutation: {
    processActivity: async (_, { text }, { dataSources }) => { 
        let activity;

        activity = await dataSources.activityAPI.processEntry(text);

        return {
            id: "__UNDEF",
            type: activity.type,
            organization: activity.organization,
            contacts: activity.persons.map(p => {
                return {
                    id: "__UNDEF",
                    firstName: p
                }
            }),
            sentiment: activity.sentiment,
            content: activity.content
        }
    },
  }
};

module.exports = {
    activityTypeDef,
    activityResolvers
}