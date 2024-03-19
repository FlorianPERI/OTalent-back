import Debug from 'debug';
const debug = Debug('app:resolvers:category');

const category = {
  trainings({ id: categoryId }, _, { dataSources }) {
    debug(`find all trainings of category [${categoryId}]`);
    return dataSources.otalentDB.trainings.findByCategoryId(categoryId);
  },
};

export default category;