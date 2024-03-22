import CoreDatamapper from './CoreDatamapper.js';

/**
 * Represents a Category data mapper.
 * @extends CoreDatamapper
 */
class Category extends CoreDatamapper {
  tableName = 'category';

  /**
   * Creates a new instance of the Category data mapper.
   * @param {object} options - The options for the data mapper.
   */
  constructor(options) {
    super(options);
    this.createDataLoaderWithJoin('Member', 'member_likes_category', 'member_id', 'category_id');
  }

  /**
   * Finds categories by member ID.
   * @param {number} id - The ID of the member.
   * @returns {Promise<Array>} - A promise that resolves to an array of categories.
   */
  async findByMemberId(id) {
    const result = await this.findByMemberIdLoader.load(id);
    return result || [];
  }
}

export default Category;
