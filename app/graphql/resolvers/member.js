import Debug from 'debug';

const debug = Debug('app:resolvers:member');

const member = {
  trainings({ id: memberId }, _, { dataSources }) {
    debug(`find all trainings of member [${memberId}]`);
    return dataSources.otalentDB.training.findByMemberId(memberId);
  },

  categories({ id: memberId }, _, { dataSources }) {
    debug(`find all categories of member[${memberId}]`);
    return dataSources.otalentDB.category.findByMemberId(memberId);
  },

  reviews({ id: memberId }, _, { dataSources }) {
    debug(`find all review of member[${memberId}]`);
    return dataSources.otalentDB.review.findByMemberId(memberId);
  }
};

export default member;
