import Debug from 'debug';
const debug = Debug('app:resolvers:review');

const review = {
    training({ training_id: trainingId }, _, { dataSources }) {
        return dataSources.otalentDB.training.findByPk(trainingId);
    },

    member({ member_id: memberId }, _, { dataSources }) {
        return dataSources.otalentDB.member.findByPk(memberId);
    },
}
export default review;