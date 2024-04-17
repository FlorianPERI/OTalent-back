import { ApolloServer } from '@apollo/server';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import cors from '@fastify/cors';
import { fastifyWebsocket } from '@fastify/websocket';
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { mergeTypeDefs } from '@graphql-tools/merge';
import Fastify from 'fastify';

import Debug from 'debug';
import depthLimit from 'graphql-depth-limit';
import {
  resolvers as scalarResolvers,
  typeDefs as scalarTypeDefs,
} from 'graphql-scalars';
import {
  createApollo4QueryValidationPlugin,
  constraintDirectiveTypeDefs,
} from 'graphql-constraint-directive/apollo4.js';
import pino from 'pino';
import pretty from 'pino-pretty';
import Redis from 'ioredis';
import SonicBoom from 'sonic-boom';
import dayjs from 'dayjs';
import 'dayjs/locale/fr.js';
import 'dayjs/plugin/utc.js';

import auth from './app/services/auth/index.js';
import OtalentDB from './app/graphql/dataSources/otalentDB/datamappers/index.js';
import SireneAPI from './app/graphql/dataSources/sireneAPI/index.js';
import typeDefs from './app/graphql/schemas/index.js';
import resolvers from './app/graphql/resolvers/index.js';

/** *************************************************************************************
 *
 *                              Server Settings
 *
 ************************************************************************************** */

const PORT = process.env.SERVER_PORT ?? 3000;
const debug = Debug('app:server');
const fastify = Fastify();

const logger = pino(
  pretty({
    colorize: false,
    levelFirst: true,
    translateTime: 'SYS:standard',
    destination: new SonicBoom({
      dest: `./logs/${dayjs(new Date()).format('YYYYMMDD')}.log`,
      mkdir: true,
    }),
  }),
);

/** *************************************************************************************
 *
 *                              Apollo Server Settings
 *
 ************************************************************************************** */

const allResolvers = { ...scalarResolvers, ...resolvers };
const allTypes = mergeTypeDefs([scalarTypeDefs, constraintDirectiveTypeDefs, typeDefs]);
/**
 * Creating an instance of ApolloServer
 */
const apollo = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs: allTypes, resolvers: allResolvers }),
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
  ],
  formatError: (formattedError) => {
    debug(formattedError);
    logger.error(formattedError); // Log the error to file
    return formattedError;
  },
  introspection: process.env.NODE_ENV !== 'production',
  validationRules: [depthLimit(4)],
});

/**
 * Function to provide context to ApolloServer
 */
const contextFunction = async (request) => {
  const { cache } = apollo;
  let user = null;
  if (request.headers.authorization) {
  // eslint-disable-next-line prefer-destructuring
    const token = request.headers.authorization.split(' ')[1];
    try {
      const verify = auth.verifyToken(token);
      user = await auth.getUser(verify);
      debug(user);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  return {
    user,
    dataSources: {
      otalentDB: new OtalentDB({ cache }), // Create a new instance of OtalentDB with cache
      sireneAPI: new SireneAPI({ cache }), // Create a new instance of SireneAPI with cache
    },
  };
};

await apollo.start();

/**
 * Registering ApolloServer with Fastify
 */
await fastify.register(fastifyApollo(apollo), { context: contextFunction });

/** *************************************************************************************
 *
 *                              WebSocket Settings
 *
 ************************************************************************************** */

/**
 * Setting up Redis
 */
const redis = new Redis({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
});

/**
 * Redis error handling
 */
redis.on('error', (err) => {
  debug('Error connecting to Redis', err);
});

/**
 * Registering WebSocket with Fastify
 */
fastify.register(fastifyWebsocket);

/**
 * WebSocket route
 */
fastify.register(async () => {
  fastify.get('/ws', { websocket: true }, (socket) => {
    debug('Client connected');
    socket.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      debug(`Received message ${JSON.stringify(parsedMessage)}`);
      if (parsedMessage.type === 'getAllMessages') {
        redis.lrange('messages', 0, -1, (err, messages) => {
          if (err) debug(err);
          debug(messages);
          socket.send(JSON.stringify(messages));
        });
      } else {
        redis.rpush('messages', message, (err) => {
          if (err) debug(err);
        });
      }
    });
  });
});

/** *************************************************************************************
 *
 *                                Starting the Server
 *
 ************************************************************************************** */

/**
 * Registering CORS plugin with Fastify
 */
await fastify.register(cors, { origin: ['http://localhost:3000', 'https://studio.apollographql.com/', 'https://otalentoclock.netlify.app/'] });

fastify
  .ready()
  .then(() => {
    fastify.listen({ port: PORT }, (err) => {
      if (err) {
        debug(err);
        logger.error(err);
        process.exit(1);
      }
      const serverAddress = fastify.server.address();
      debug(`🚀 Server ready at http://${serverAddress.address}:${serverAddress.port}/graphql`);
    });
  })
  .catch((err) => {
    debug(err);
    logger.error(err);
    process.exit(1);
  });
