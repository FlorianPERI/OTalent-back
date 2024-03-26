import CoreDatamapper from './CoreDatamapper.js';

/**
 * Represents a Member datamapper.
 * @extends CoreDatamapper
 */
class Member extends CoreDatamapper {
  tableName = 'member';

  constructor(options) {
    super(options);
    this.createAssociationMethods('Member', 'Category');
    this.createAssociationMethods('Member', 'Training');
    this.createDataLoaderWithJoin('Training', 'member_likes_training', 'member_id', 'training_id');
    this.createDataLoaderWithJoin('Category', 'member_likes_category', 'member_id', 'category_id');
  }
  /**
   * Creates a new instance of the Member datamapper.
   * @param {object} options - The options for the datamapper.
   */
  // constructor(options) {
  //   super(options);
  //   this.setupEntity('Training', 'member_likes_training', 'member_id', 'training_id');
  //   this.setupEntity('Category', 'member_likes_category', 'member_id', 'category_id');
  // }

  /**
   * Finds members by training ID.
   * @param {number} id - The training ID.
   * @returns {Promise<Array>} - A promise that resolves to an array of members.
   */
  async findByTrainingId(id) {
    const result = await this.findByTrainingIdLoader.load(id);
    return result || [];
  }

  /**
   * Finds members by category ID.
   * @param {number} id - The category ID.
   * @returns {Promise<Array>} - A promise that resolves to an array of members.
   */
  async findByCategoryId(id) {
    const result = await this.findByCategoryIdLoader.load(id);
    return result || [];
  }
}

export default Member;
