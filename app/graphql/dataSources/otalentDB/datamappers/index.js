import client from '../services/client.js';
import MemberDatamapper from './Member.js';
import ReviewDatamapper from './Review.js';
import TrainingDatamapper from './Training.js';
import CategoryDatamapper from './Category.js';
import OrganizationDatamapper from './Organization.js';

/**
 * Represents the OtalentDB class which serves as a data mapper for various entities.
 * @typedef {Object} OtalentDB
 */
class OtalentDB {
  /**
   * Creates an instance of OtalentDB.
   * @param {object} options - The options for configuring the data mapper.
   * @param {object} options.client - The client object for connecting to the database.
   */
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
