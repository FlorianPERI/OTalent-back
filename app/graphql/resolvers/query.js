import { createQueryMethods } from './utils/createMethods.js';

/**
 * Resolvers for the Query type.
 * @typedef {Object} Query
 * @property {Function} member - Resolver for member field.
 * @property {Function} organization - Resolver for organization field.
 * @property {Function} review - Resolver for review field.
 * @property {Function} training - Resolver for training field.
 * @property {Function} category - Resolver for category field.
 */
const query = {
  // Creates findByPK and findAll methods for each type
  ...createQueryMethods('member'),
  ...createQueryMethods('organization'),
  ...createQueryMethods('review'),
  ...createQueryMethods('training'),
  ...createQueryMethods('category', 'categories'),
  siret: (_, { siret }, { dataSources }) => dataSources.sireneAPI.getInformationsBySiret(siret),
  distance: (
    _,
    { memberPostalCode, organizationPostalCode },
    { dataSources },
  ) => dataSources.bingMapAPI.getDistance(
    memberPostalCode,
    organizationPostalCode,
  ),
  trainingsByRegion: (_, { regionName }, { dataSources }) => dataSources
    .otalentDB.training.findByRegion(regionName),
};

export default query;
