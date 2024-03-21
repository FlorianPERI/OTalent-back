import Fastify from 'fastify';
import { ApolloServer } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import cors from '@fastify/cors';
import Debug from 'debug';
import typeDefs from './app/graphql/schemas/index.js';
import resolvers from './app/graphql/resolvers/index.js';
import OtalentDB from './app/graphql/dataSources/otalentDB/datamappers/index.js';

const debug = Debug('app:server');
const fastify = Fastify();

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [fastifyApolloDrainPlugin(fastify)],
});

const contextFunction = async () => ({
  dataSources: {
    otalentDB: new OtalentDB(),
  },
});

await apollo.start();
await fastify.register(cors, { origin: '*' });
await fastify.register(fastifyApollo(apollo), { context: contextFunction });

fastify.listen({ port: process.env.SERVER_PORT ?? 3000 }, (err) => {
  if (err) {
    debug(err);
  }
  const serverAddress = fastify.addresses().find((address) => address.family === 'IPv4');
  debug(`🚀 Server ready at http://${serverAddress.address}:${serverAddress.port}/graphql`);
});
