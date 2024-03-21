import Debug from 'debug';
import client from '../services/client.js';
import MemberDatamapper from './Member.js';
import ReviewDatamapper from './Review.js';
import TrainingDatamapper from './Training.js';
import CategoryDatamapper from './Category.js';
import OrganizationDatamapper from './Organization.js';

class OtalentDB {
  constructor(options = {}) {
    // eslint-disable-next-line no-param-reassign
    options.client = client;
    this.member = new MemberDatamapper(options);
    this.review = new ReviewDatamapper(options);
    this.training = new TrainingDatamapper(options);
    this.category = new CategoryDatamapper(options);
    this.organization = new OrganizationDatamapper(options);
  }
}

export default OtalentDB;
