import { createMethods } from '../utils/createMethods.js';

const organization = {
  ...createMethods('Trainings', 'findByOrganizationId'),
};

export default organization;
