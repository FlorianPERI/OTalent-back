import Debug from 'debug';

const debug = Debug('app:resolvers:query');

const query = {
  // member(_, { id }, { dataSources }) {
  //   debug(`find member [${id}]`);
  //   /* return dataSources.otalentDB.member.findByPk(id); */
  // },
  // members(_, __, { dataSources }) {
  //   debug('find all members');
  //   /* return dataSources.otalentDB.member.findAll(); */
  // },
  // organization(_, { id }, { dataSources }) {
  //   debug(`find organization [${id}]`);
  //   /* return dataSources.otalentDB.organization.findByPk(id); */
  // },
  // organizations(_, __, { dataSources }) {
  //   debug('find all organizations');
  //   /* return dataSources.otalentDB.organization.findAll(); */
  // },
  // review(_, { id }, { dataSources }) {
  //   debug(`find review [${id}]`);
  //   /* return dataSources.otalentDB.review.findByPk(id); */
  // },
  // reviews(_, __, { dataSources }) {
  //   debug('find all reviews');
  //   /* return dataSources.otalentDB.review.findAll(); */
  // },
  // training(_, { id }, { dataSources }) {
  //   debug(`find training [${id}]`);
  //   /* return dataSources.otalentDB.training.findByPk(id); */
  // },
  // trainings(_, __, { dataSources }) {
  //   debug('find all trainings');
  //   /* return dataSources.otalentDB.training.findAll(); */
  // },
  category(_, { id }, { dataSources }) {
    debug(`find category [${id}]`);
    return dataSources.otalentDB.category.findByPk(id);
  },
  categories(_, __, { dataSources }) {
    debug('find all categories');
    return dataSources.otalentDB.category.findAll();
  },
};

export default query;
