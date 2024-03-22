import Debug from 'debug';

const debug = Debug('app:resolvers:training');

const training = {
  category({ id, category_id: categoryId }, _, { dataSources }) {
    debug(`find category of training [${id}]`);
    return dataSources.otalentDB.category.findByPk(categoryId);
  },

  organization({ id, organization_id: organizationId }, _, { dataSources }) {
    debug(`find organization of training [${id}]`);
    return dataSources.otalentDB.organization.findByPk(organizationId);
  },

  members({ id }, _, { dataSources }) {
    debug(`find all members of training [${id}]`);
    return dataSources.otalentDB.member.findByTrainingId(id);
  },

  reviews({ id }, _, { dataSources }) {
    debug(`find all reviews of training [${id}]`);
    return dataSources.otalentDB.review.findByTrainingId(id);
  },

  averageRating({ id }, _, { dataSources }) {
    debug(`find average of ratings for training[${id}]`);
    return dataSources.otalentDB.review.findAverageRatingOfTraining(id);
  }
};

export default training;
