import { createMethods } from '../utils/createMethods.js';

/**
 * Resolvers for the Member type.
 * @typedef {Object} Member
 * @property {Function} Trainings - Resolver for Trainings field.
 * @property {Function} Categories - Resolver for Categories field.
 * @property {Function} Reviews - Resolver for Reviews field.
 */
const member = {
  ...createMethods('Trainings', 'findByMemberId'),
  ...createMethods('Categories', 'findByMemberId'),
  ...createMethods('Reviews', 'findByMemberId'),
};

export default member;
