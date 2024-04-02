import pino from 'pino';
import pretty from 'pino-pretty';
import SonicBoom from 'sonic-boom';
import Fastify from 'fastify';
import { ApolloServer } from '@apollo/server';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import cors from '@fastify/cors';
import Debug from 'debug';
import { resolvers as scalarResolvers, typeDefs as scalarTypeDefs } from 'graphql-scalars';
import dayjs from 'dayjs';
import { createApollo4QueryValidationPlugin, constraintDirectiveTypeDefs } from 'graphql-constraint-directive/apollo4.js';
import jwt from 'jsonwebtoken';
import typeDefs from './app/graphql/schemas/index.js';
import resolvers from './app/graphql/resolvers/index.js';
import OtalentDB from './app/graphql/dataSources/otalentDB/datamappers/index.js';
import SireneAPI from './app/graphql/dataSources/sireneAPI/index.js';
import auth from './app/services/auth/index.js';

/**
 * Setting up the server
 */
const PORT = process.env.SERVER_PORT ?? 3000;
const debug = Debug('app:server');
const fastify = Fastify();

/**
 * Setting up the log files
 */
const logger = pino(pretty({
  colorize: false,
  levelFirst: true,
  translateTime: 'SYS:standard',
  destination: new SonicBoom({ dest: `./logs/${dayjs(new Date()).format('YYYYMMDD')}.log`, mkdir: true }),
}));

/**
 * Creating an instance of ApolloServer
 */
const apollo = new ApolloServer({
  typeDefs: [
    ...scalarTypeDefs, // Add custom scalar type definitions
    constraintDirectiveTypeDefs, // Add constraint directive type definitions
    typeDefs,
  ],
  resolvers: [
    scalarResolvers, // Add custom scalar type resolvers
    resolvers,
  ],
  cache: new InMemoryLRUCache({
    max: 500, // 500 items
    maxSize: 2 ** 20 * 50, // 50MB
    sizeCalculation: (value, key) => (value.length + key.length) * 2, // 2 bytes per char
    ttl: 300, // 5 minutes
  }),
  plugins: [
    fastifyApolloDrainPlugin(fastify),
    createApollo4QueryValidationPlugin(),
    responseCachePlugin(),
    ApolloServerPluginCacheControl({
      defaultMaxAge: 10,
    })],
  formatError: (formattedError, error) => {
    debug(formattedError);
    logger.error(formattedError); // Log the error to file
    return formattedError;
  },

});

/**
 * Function to provide context to ApolloServer
 */
const contextFunction = async (request) => {
  const { cache } = apollo; // Get the cache from ApolloServer
  // let loggedIn = false;
  let user = null;
  if (request.headers.authorization) {
    // eslint-disable-next-line prefer-destructuring
    const token = request.headers.authorization.split(' ')[1];
    try {
      const verify = auth.verifyToken(token);
      user = await auth.getUser(verify);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  return {
    // loggedIn: !!user,
    user,
    dataSources: {
      otalentDB: new OtalentDB({ cache }), // Create a new instance of OtalentDB with cache
      sireneAPI: new SireneAPI({ cache }), // Create a new instance of OtalentDB with cache
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
    logger.error(err);
    process.exit(1);
  }
  debug(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
