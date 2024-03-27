import { createMethods } from '../utils/createMethods.js';

/**
 * Resolvers for the Organization type.
 * @typedef {Object} Organization
 * @property {Function} Trainings - Resolver for Trainings field.
 */
const organization = {
  ...createMethods('Trainings', 'findByOrganizationId'), // Find the trainings of the organization
};

export default organization;
