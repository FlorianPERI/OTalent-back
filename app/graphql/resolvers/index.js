import Query from './query.js';
import Mutation from './mutation.js';
import Member from './member.js';
import Organization from './organization.js';
import Review from './review.js';
import Training from './training.js';
import Category from './category.js';

/**
 * Combine all the GraphQL resolvers into a single object.
 * @typedef {Object} Resolvers
 * @property {Object} Query - Resolver for Query type.
 * @property {Object} Mutation - Resolver for Mutation type.
 * @property {Object} Member - Resolver for Member type.
 * @property {Object} Organization - Resolver for Organization type.
 * @property {Object} Review - Resolver for Review type.
 * @property {Object} Training - Resolver for Training type.
 * @property {Object} Category - Resolver for Category type.
 */
const resolvers = {
  Query,
  Mutation,
  Member,
  Organization,
  Review,
  Training,
  Category,
};
export default resolvers;
