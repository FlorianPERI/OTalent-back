import { createMethods } from './utils/createMethods.js';

/**
 * Resolvers for the Member type.
 * @typedef {Object} Member
 * @property {Function} Trainings - Resolver for Trainings field.
 * @property {Function} Categories - Resolver for Categories field.
 * @property {Function} Reviews - Resolver for Reviews field.
 */
const member = {
  ...createMethods('Trainings', 'findByMemberId'), // Find the trainings of the member
  ...createMethods('Categories', 'findByMemberId'), // Find the categories of the member
  ...createMethods('Reviews', 'findByMemberId'), // Find the reviews of the member
  nearestOrganizations({ postal_code: postalCode }, __, { dataSources }) {
    return dataSources.otalentDB.organization.findOrganizationsByMemberPostalCode(postalCode);
  },
};

export default member;
