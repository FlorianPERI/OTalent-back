import Debug from 'debug';

const debug = Debug('app:resolvers:review');

const review = {
  training({ id, training_id: trainingId }, _, { dataSources }) {
    debug(`find training of review [${id}]`);
    return dataSources.otalentDB.training.findByPk(trainingId);
  },

  member({ id, member_id: memberId }, _, { dataSources }) {
    debug(`find member of review [${id}]`);
    return dataSources.otalentDB.member.findByPk(memberId);
  },
};
export default review;
