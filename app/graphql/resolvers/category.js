import { createMethods } from '../utils/createMethods.js';

const category = {
  ...createMethods('Trainings', 'findByCategoryId'),
  ...createMethods('Members', 'findByCategoryId'),
};

export default category;
