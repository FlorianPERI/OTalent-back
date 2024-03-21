import Debug from 'debug';

const debug = Debug('app:resolvers:member');

const member = {
  trainings({ id }, _, { dataSources }) {
    debug(`find all trainings of member [${id}]`);
    return dataSources.otalentDB.training.findByMemberId(id);
  },

  categories({ id }, _, { dataSources }) {
    debug(`find all categories of member [${id}]`);
    return dataSources.otalentDB.category.findByMemberId(id);
  },

  reviews({ id }, _, { dataSources }) {
    debug(`find all reviews of member [${id}]`);
    return dataSources.otalentDB.review.findByMemberId(id);
  },
};

export default member;
