import CoreDatamapper from './CoreDatamapper.js';

/**
 * Represents a Training data mapper.
 * @extends CoreDatamapper
 */
class Training extends CoreDatamapper {
  tableName = 'training';

  /**
   * Creates a new instance of the Training data mapper.
   * @param {object} options - The options for the data mapper.
   */
  constructor(options) {
    super(options);
    this.createDataLoader('Organization', 'organization_id');
    this.createDataLoader('Category', 'category_id');
    this.createDataLoaderWithJoin('Member', 'member_likes_training', 'training_id', 'member_id');
  }

  /**
   * Finds trainings by member ID.
   * @param {number} id - The member ID.
   * @returns {Promise<Array>} - A promise that resolves to an array of trainings.
   */
  async findByMemberId(id) {
    const result = await this.findByMemberIdLoader.load(id);
    return result || [];
  }

  /**
   * Finds trainings by organization ID.
   * @param {number} id - The organization ID.
   * @returns {Promise<Array>} - A promise that resolves to an array of trainings.
   */
  async findByOrganizationId(id) {
    const result = await this.findByOrganizationIdLoader.load(id);
    return result || [];
  }

  /**
   * Finds trainings by category ID.
   * @param {number} id - The category ID.
   * @returns {Promise<Array>} - A promise that resolves to an array of trainings.
   */
  async findByCategoryId(id) {
    const result = await this.findByCategoryIdLoader.load(id);
    return result || [];
  }
}

export default Training;
