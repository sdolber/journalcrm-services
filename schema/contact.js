const { gql } = require('apollo-server');

const contactTypeDef = gql`
    extend type Query {
        contact(id: String!): Contact
    }  

    type Contact {
        id: String!
        firstName: String!
        lastName: String
        email: String
    }
`;

const contactResolvers = {
  Query: {
    contact: () => {  },
  }
};

module.exports = {
    contactTypeDef,
    contactResolvers
};