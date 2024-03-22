import { createMutationMethods, createAssociationMethods } from '../utils/createMethods.js';

const mutation = {
  ...createMutationMethods('Member'),
  ...createMutationMethods('Organization'),
  ...createMutationMethods('Training'),
  ...createMutationMethods('Review'),
  ...createMutationMethods('Category'),
  ...createAssociationMethods('Member', 'Category'),
  ...createAssociationMethods('Member', 'Training'),
};

export default mutation;
