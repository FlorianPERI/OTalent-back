import { createQueryMethods } from '../utils/createMethods.js';

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
  ...createQueryMethods('member'),
  ...createQueryMethods('organization'),
  ...createQueryMethods('review'),
  ...createQueryMethods('training'),
  ...createQueryMethods('category', 'categories'),
};

export default query;
