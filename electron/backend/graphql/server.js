/* eslint-disable @typescript-eslint/no-var-requires */
const { GraphQLServer } = require('graphql-yoga');
const path = require('path');

const resolvers = require('./resolvers');

const typeDefs = path.join(__dirname, 'schema.graphql');

const server = new GraphQLServer({ typeDefs, resolvers });

module.exports = server;
