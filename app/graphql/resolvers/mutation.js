import { createMutationMethods/* , createAssociationMethods */ } from '../utils/createMethods.js';

/**
 * Resolvers for the Mutation type.
 * @typedef {Object} Mutation
 * @property {Function} Member - Resolver for Member field.
 * @property {Function} Organization - Resolver for Organization field.
 * @property {Function} Training - Resolver for Training field.
 * @property {Function} Review - Resolver for Review field.
 * @property {Function} Category - Resolver for Category field.
 * @property {Function} Member_Category - Resolver for Member_Category association.
 * @property {Function} Member_Training - Resolver for Member_Training association.
 */
const mutation = {
  ...createMutationMethods('Member'),
  ...createMutationMethods('Organization'),
  ...createMutationMethods('Training'),
  ...createMutationMethods('Review'),
  ...createMutationMethods('Category'),
  // ...createAssociationMethods('Member', 'Category'),
  // ...createAssociationMethods('Member', 'Training'),
  associateMemberCategory(_, { memberId, categoryId }, { dataSources }) {
    return dataSources.otalentDB.member.associateMemberCategory(memberId, categoryId);
  },
  associateMemberTraining(_, { memberId, trainingId }, { dataSources }) {
    return dataSources.otalentDB.member.associateMemberTraining(memberId, trainingId);
  },

};
export default mutation;
