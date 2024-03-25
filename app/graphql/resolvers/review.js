import { createMethods } from '../utils/createMethods.js';

/**
* Resolvers for the Review type.
* @typedef {Object} Review
* @property {Function} Training - Resolver for Training field.
* @property {Function} Member - Resolver for Member field.
*/
const review = {
  ...createMethods('Training', 'findByPk', 'training_id'),
  ...createMethods('Member', 'findByPk', 'member_id'),
};

export default review;
