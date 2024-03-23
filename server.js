/**
 * Importing required modules and packages
 */
import Fastify from 'fastify';
import { ApolloServer } from '@apollo/server';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import cors from '@fastify/cors';
import Debug from 'debug';
import { resolvers as scalarResolvers, typeDefs as scalarTypeDefs } from 'graphql-scalars';
import typeDefs from './app/graphql/schemas/index.js';
import resolvers from './app/graphql/resolvers/index.js';
import OtalentDB from './app/graphql/dataSources/otalentDB/datamappers/index.js';

/**
 * Setting up the server
 */
const PORT = process.env.SERVER_PORT ?? 3000;
const debug = Debug('app:server');
const fastify = Fastify();

/**
 * Creating an instance of ApolloServer
 */
const apollo = new ApolloServer({
  typeDefs: [
    ...scalarTypeDefs,
    typeDefs,
  ],
  resolvers: [
    scalarResolvers,
    resolvers,
  ],
  cache: new InMemoryLRUCache({
    max: 500,
    maxSize: 2 ** 20 * 50,
    sizeCalculation: (value, key) => (value.length + key.length) * 2,
    ttl: 300,
  }),
  plugins: [fastifyApolloDrainPlugin(fastify)],
});

/**
 * Function to provide context to ApolloServer
 */
const contextFunction = async () => {
  const { cache } = apollo;
  return {
    dataSources: {
      otalentDB: new OtalentDB({ cache }),
    },
  };
};

/**
 * Starting ApolloServer
 */
await apollo.start();

/**
 * Registering CORS plugin with Fastify
 */
await fastify.register(cors, { origin: '*' });

/**
 * Registering ApolloServer with Fastify
 */
await fastify.register(fastifyApollo(apollo), { context: contextFunction });

/**
 * Starting the server
 */
fastify.listen({ port: PORT }, (err) => {
  if (err) {
    debug(err);
  }
  debug(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
