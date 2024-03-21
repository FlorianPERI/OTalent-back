import Fastify from 'fastify';
import { ApolloServer } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import Debug from 'debug';
import typeDefs from './app/graphql/schemas/index.js';
import resolvers from './app/graphql/resolvers/index.js';
import OtalentDB from './app/graphql/dataSources/otalentDB/datamappers/index.js';

const PORT = process.env.SERVER_PORT ?? 3000;
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

await fastify.register(fastifyApollo(apollo), { context: contextFunction });

fastify.listen({ port: PORT }, (err) => {
  if (err) {
    debug(err);
  }
  debug(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
