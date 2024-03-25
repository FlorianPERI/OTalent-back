import { createMethods } from '../utils/createMethods.js';

/**
 * Resolvers for the Category type.
 * @typedef {Object} Category
 * @property {Function} Trainings - Resolver for Trainings field.
 * @property {Function} Members - Resolver for Members field.
 */
const category = {
  ...createMethods('Trainings', 'findByCategoryId'),
  ...createMethods('Members', 'findByCategoryId'),
};

export default category;
