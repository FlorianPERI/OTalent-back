import CoreDatamapper from './CoreDatamapper.js';

/**
 * Represents a Member datamapper.
 * @extends CoreDatamapper
 */
class Member extends CoreDatamapper {
  tableName = 'member';

  /**
   * Creates a new instance of the Member datamapper.
   * @param {object} options - The options for the datamapper.
   */
  constructor(options) {
    super(options);
    this.setupEntity('Training', 'member_likes_training', 'member_id', 'training_id');
    this.setupEntity('Category', 'member_likes_category', 'member_id', 'category_id');
  }

  /**
   * Sets up an entity with the specified parameters.
   * @param {string} entityName - The name of the entity.
   * @param {string} tableName - The name of the table.
   * @param {string} condition - The condition for the join.
   * @param {string} idField - The ID field for the join.
   */
  setupEntity(entityName, tableName, condition, idField) {
    this.createDataLoaderWithJoin(entityName, tableName, condition, idField);
    this.createAssociationMethods(entityName, tableName);
  }

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
