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
  ...createMethods('Category', 'findByPk', 'category_id'), // Find the category of the training
  ...createMethods('Organization', 'findByPk', 'organization_id'), // Find the organization of the training
  ...createMethods('Members', 'findByTrainingId'), // Find the members of the training
  ...createMethods('Reviews', 'findByTrainingId'), // Find the reviews of the training
  averageRating: ({ id }, _, { dataSources }) => dataSources.otalentDB.review
    .findAverageRatingOfTraining(id),
  dates: (parent) => parent.dates.map((dateStr) => new Date(dateStr))
  ,
};

export default training;
