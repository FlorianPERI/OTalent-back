import Debug from 'debug';

const debug = Debug('app:resolvers:member');

const member = {
  trainings({ id: memberId }, _, { dataSources }) {
    debug(`find all trainings of member [${memberId}]`);
    return dataSources.otalentDB.trainings.findByMemberId(memberId);
  },
};

export default member;
