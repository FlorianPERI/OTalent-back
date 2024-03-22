import { createMethods } from '../utils/createMethods.js';

const member = {
  ...createMethods('Trainings', 'findByMemberId'),
  ...createMethods('Categories', 'findByMemberId'),
  ...createMethods('Reviews', 'findByMemberId'),
};

export default member;
