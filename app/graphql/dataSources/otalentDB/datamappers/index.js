import client from '../services/client.js';
import MemberDatamapper from './Member.js';
import ReviewDatamapper from './Review.js';
import TrainingDatamapper from './Training.js';
import CategoryDatamapper from './Category.js';
import OrganizationDatamapper from './Organization.js';

/**
 * Represents the OtalentDB class which serves as a data mapper for various entities.
 * @class OtalentDB
 */
class OtalentDB {
  /**
     * Creates an instance of OtalentDB.
     * @param {object} options - The options for configuring the data mapper.
     * @param {object} options.client - The client object for connecting to the database.
     */
  constructor(options = {}) {
    const optionsCopy = { ...options, client };
    this.member = new MemberDatamapper(optionsCopy);
    this.review = new ReviewDatamapper(optionsCopy);
    this.training = new TrainingDatamapper(optionsCopy);
    this.category = new CategoryDatamapper(optionsCopy);
    this.organization = new OrganizationDatamapper(optionsCopy);
  }
}

export default OtalentDB;
