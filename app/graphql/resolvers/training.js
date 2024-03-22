import { createMethods } from '../utils/createMethods.js';

const training = {
  ...createMethods('Category', 'findByPk'),
  ...createMethods('Organization', 'findByPk'),
  ...createMethods('Members', 'findByTrainingId'),
  ...createMethods('Reviews', 'findByTrainingId'),
  averageRating: ({ id }, _, { dataSources }) => dataSources.otalentDB.review.findAverageRatingOfTraining(id),
};

export default training;
