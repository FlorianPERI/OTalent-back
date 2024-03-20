import Fastify from 'fastify';
import { ApolloServer } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import Debug from 'debug';
import typeDefs from './app/graphql/schemas/index.js';
import resolvers from './app/graphql/resolvers/index.js';

const debug = Debug('app:server');
const fastify = Fastify();

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [fastifyApolloDrainPlugin(fastify)],
});

await apollo.start();

await fastify.register(fastifyApollo(apollo));

fastify.listen({ port: process.env.SERVER_PORT ?? 3000 }, (err) => {
  if (err) {
    debug(err);
  }
  const serverAddress = fastify.addresses().find((address) => address.family === 'IPv4');
  debug(`🚀 Server ready at http://${serverAddress.address}:${serverAddress.port}/graphql`);
});
