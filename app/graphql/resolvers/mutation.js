import Debug from 'debug';

const debug = Debug('app:resolvers:mutation');

const mutation = {
  addMember(_, args, { dataSources }) {
    debug(`add new member [${args.firstname}]`);
    return dataSources.otalentDB.member.insert(args);
  },
  modifyMember(_, { id, input }, { dataSources }) {
    debug(`modify member [${id}]`);
    return dataSources.otalentDB.member.update(id, input);
  },
  deleteMember(_, { id }, { dataSources }) {
    debug(`delete member [${id}]`);
    return dataSources.otalentDB.member.delete(id);
  },

  addOrganization(_, args, { dataSources }) {
    debug(`add new organization [${args.name}]`);
    return dataSources.otalentDB.organization.insert(args);
  },
  modifyOrganization(_, { id, input }, { dataSources }) {
    debug(`modify organization [${id}]`);
    return dataSources.otalentDB.organization.update(id, input);
  },
  deleteOrganization(_, { id }, { dataSources }) {
    debug(`delete organization [${id}]`);
    return dataSources.otalentDB.organization.delete(id);
  },

  addTraining(_, args, { dataSources }) {
    debug(`add new training [${args.name}]`);
    return dataSources.otalentDB.training.insert(args);
  },
  modifyTraining(_, { id, input }, { dataSources }) {
    debug(`modify training [${id}]`);
    return dataSources.otalentDB.training.update(id, input);
  },
  deleteTraining(_, { id }, { dataSources }) {
    debug(`delete training [${id}]`);
    return dataSources.otalentDB.training.delete(id);
  },

  addReview(_, args, { dataSources }) {
    debug(`add new review [${args.title}]`);
    return dataSources.otalentDB.review.insert(args);
  },
  modifyReview(_, { id, input }, { dataSources }) {
    debug(`modify review [${id}]`);
    return dataSources.otalentDB.review.update(id, input);
  },
  deleteReview(_, { id }, { dataSources }) {
    debug(`delete review [${id}]`);
    return dataSources.otalentDB.review.delete(id);
  },

  addCategory(_, args, { dataSources }) {
    debug(`add new category [${args.name}]`);
    return dataSources.otalentDB.category.insert(args);
  },
  modifyCategory(_, { id, input }, { dataSources }) {
    debug(`modify category [${id}]`);
    return dataSources.otalentDB.category.update(id, input);
  },
  deleteCategory(_, { id }, { dataSources }) {
    debug(`delete category [${id}]`);
    return dataSources.otalentDB.category.delete(id);
  },

  associateMemberCategory(_, { memberId, categoryId }, { dataSources }) {
    debug(`associate member [${memberId}] and [${categoryId}] `);
    return dataSources.otalentDB.member.associateMemberCategory(memberId, categoryId);
  },
  dissociateMemberCategory(_, { memberId, categoryId }, { dataSources }) {
    debug(`dissociate member [${memberId}] and [${categoryId}] `);
    return dataSources.otalentDB.member.dissociateMemberCategory(memberId, categoryId);
  },

  associateMemberTraining(_, { memberId, trainingId }, { dataSources }) {
    debug(`associate member [${memberId}] and [${trainingId}] `);
    return dataSources.otalentDB.member.associateMemberTraining(memberId, trainingId);
  },
  dissociateMemberTraining(_, { memberId, trainingId }, { dataSources }) {
    debug(`dissociate member [${memberId}] and [${trainingId}] `);
    return dataSources.otalentDB.member.dissociateMemberTraining(memberId, trainingId);
  },
};

export default mutation;
