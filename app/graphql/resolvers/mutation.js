import Debug from 'debug';

const debug = Debug('app:resolvers:mutation');

const query = {
  addMember(_, args, { dataSources }) {
    debug(`find member [${id}]`);
    /* return dataSources.otalentDB.member.insert(args); */
  },
  modifyMember(_, { id, input }, { dataSources }) {
    debug('find all members');
    /* return dataSources.otalentDB.member.update(id, input); */
  },
  deleteMember(_, { id }, { dataSources }) {
    debug('find all members');
    /* return dataSources.otalentDB.member.delete(id); */
  },

  addOrganization(_, args, { dataSources }) {
    debug(`find member [${id}]`);
    /* return dataSources.otalentDB.organization.insert(args); */
  },
  modifyOrganization(_, { id, input }, { dataSources }) {
    debug('find all members');
    /* return dataSources.otalentDB.organization.update(id, input); */
  },
  deleteOrganization(_, { id }, { dataSources }) {
    debug('find all members');
    /* return dataSources.otalentDB.organization.delete(id); */
  },

  addTraining(_, args, { dataSources }) {
    debug(`find member [${id}]`);
    /* return dataSources.otalentDB.training.insert(args); */
  },
  modifyTraining(_, { id, input }, { dataSources }) {
    debug('find all members');
    /* return dataSources.otalentDB.training.update(id, input); */
  },
  deleteTraining(_, { id }, { dataSources }) {
    debug('find all members');
    /* return dataSources.otalentDB.training.delete(id); */
  },

  addReview(_, args, { dataSources }) {
    debug(`find member [${id}]`);
    /* return dataSources.otalentDB.review.insert(args); */
  },
  modifyReview(_, { id, input }, { dataSources }) {
    debug('find all members');
    /* return dataSources.otalentDB.review.update(id, input); */
  },
  deleteReview(_, { id }, { dataSources }) {
    debug('find all members');
    /* return dataSources.otalentDB.review.delete(id); */
  },

  addCategory(_, args, { dataSources }) {
    debug(`find member [${id}]`);
    /* return dataSources.otalentDB.category.insert(args); */
  },
  modifyCategory(_, { id, input }, { dataSources }) {
    debug('find all members');
    /* return dataSources.otalentDB.category.update(id, input); */
  },
  deleteCategory(_, { id }, { dataSources }) {
    debug('find all members');
    /* return dataSources.otalentDB.category.delete(id); */
  },
};

export default query;
