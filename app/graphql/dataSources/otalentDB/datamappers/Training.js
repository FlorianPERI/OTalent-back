import CoreDatamapper from './CoreDatamapper.js';
import { getDepartementsCode } from './utils/datamapperUtils.js';

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
    this.byEntityIdDataLoader('Organization', 'organization_id');
    this.byEntityIdDataLoader('Category', 'category_id');
    this.joinDataLoader('Member', 'member_likes_training', 'training_id', 'member_id');
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

  async findByRegion(region) {
    const departmentsCode = getDepartementsCode(region);
    const placeholders = departmentsCode.map((code, index) => `$${index + 1}`).join(',');
    const values = departmentsCode.map((code) => `${code}%`);
    const query = {
      text: `SELECT * FROM training WHERE organization_id IN (
                SELECT id FROM organization WHERE postal_code LIKE ANY(ARRAY[${placeholders}])
            );`,
      values,
    };
    const response = await this.client.query(query);
    return response.rows;
  }
}

export default Training;
