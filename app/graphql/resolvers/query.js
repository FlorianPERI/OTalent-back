import Debug from 'debug';
const debug = Debug('app:resolvers:query');

const query = {
  member(_, __, { dataSources }) {
    debug(`find member [${id}]`);
    /* return dataSources.otalentDB.member.findByPk(id); */
  },
  members(_, { id }, { dataSources }) {
    debug(`find all members`);
    /* return dataSources.otalentDB.member.findAll(); */
  },
  organization(_, __, { dataSources }) {
    debug(`find organization [${id}]`);
    /* return dataSources.otalentDB.organization.findByPk(id); */
  },
  organizations(_, { id }, { dataSources }) {
    debug('find all organizations');
    /* return dataSources.otalentDB.organization.findAll(); */
  },
  review(_, __, { dataSources }) {
    debug(`find review [${id}]`);
    /* return dataSources.otalentDB.review.findByPk(id); */
  },
  reviews(_, { id }, { dataSources }) {
    debug('find all reviews');
    /* return dataSources.otalentDB.review.findAll(); */
  },
  training(_, __, { dataSources }) {
    debug(`find training [${id}]`);
    /* return dataSources.otalentDB.training.findByPk(id); */
  },
  trainings(_, { id }, { dataSources }) {
    debug('find all trainings');
    /* return dataSources.otalentDB.training.findAll(); */
  },
  category(_, __, { dataSources }) {
    debug(`find category [${id}]`);
    /* return dataSources.otalentDB.category.findByPk(id); */
  },
  categories(_, { id }, { dataSources }) {
    debug('find all categories');
    /* return dataSources.otalentDB.category.findAll(); */
  },
};

export default query;