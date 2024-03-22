import { createMethods } from '../utils/createMethods.js';

const review = {
  ...createMethods('Training', 'findByPk'),
  ...createMethods('Member', 'findByPk'),
};

export default review;
