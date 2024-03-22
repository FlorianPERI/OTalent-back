import { createQueryMethods } from '../utils/createMethods.js';

const query = {
  ...createQueryMethods('Member'),
  ...createQueryMethods('Organization'),
  ...createQueryMethods('Review'),
  ...createQueryMethods('Training'),
  ...createQueryMethods('Category', 'Categories'),
};

export default query;
