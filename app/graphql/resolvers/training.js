import { createMethods } from '../utils/createMethods.js';

/**
 * Resolvers for the Training type.
 * @typedef {Object} Training
 * @property {Function} Category - Resolver for Category field.
 * @property {Function} Organization - Resolver for Organization field.
 * @property {Function} Members - Resolver for Members field.
 * @property {Function} Reviews - Resolver for Reviews field.
 * @property {Function} averageRating - Resolver for averageRating field.
 */
const training = {
  ...createMethods('Category', 'findByPk', 'category_id'),
  ...createMethods('Organization', 'findByPk', 'organization_id'),
  ...createMethods('Members', 'findByTrainingId'),
  ...createMethods('Reviews', 'findByTrainingId'),
  averageRating: ({ id }, _, { dataSources }) => dataSources.otalentDB.review.findAverageRatingOfTraining(id),
};

export default training;
