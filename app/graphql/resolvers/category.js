import Debug from 'debug';

const debug = Debug('app:resolvers:category');

const category = {
  trainings({ id }, _, { dataSources }) {
    debug(`find all trainings of category [${id}]`);
    return dataSources.otalentDB.training.findByCategoryId(id);
  },

  members({ id }, _, { dataSources }) {
    debug(`find all members of category [${id}]`);
    return dataSources.otalentDB.member.findByCategoryId(id);
  },
};

export default category;
