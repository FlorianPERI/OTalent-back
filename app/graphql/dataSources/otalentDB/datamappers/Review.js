import CoreDatamapper from './CoreDatamapper.js';

/**
 * Represents a Review data mapper.
 * @extends CoreDatamapper
 */
class Review extends CoreDatamapper {
  tableName = 'review';

  /**
   * Creates a new instance of the Review data mapper.
   * @param {object} options - The options for the data mapper.
   */
  constructor(options) {
    super(options);
    this.createDataLoader('Training', 'review', 'training_id');
    this.createDataLoader('Member', 'review', 'member_id');
    this.createAverageRatingDataLoader('Training', 'review', 'training_id');
  }

  /**
   * Finds reviews by training ID.
   * @param {number} id - The ID of the training.
   * @returns {Promise<Array>} A promise that resolves to an array of reviews.
   */
  async findByTrainingId(id) {
    const result = await this.findByTrainingIdLoader.load(id);
    return result || [];
  }

  /**
   * Finds reviews by member ID.
   * @param {number} id - The ID of the member.
   * @returns {Promise<Array>} A promise that resolves to an array of reviews.
   */
  async findByMemberId(id) {
    const result = await this.findByMemberIdLoader.load(id);
    return result || [];
  }

  /**
   * Finds the average rating of a training.
   * @param {number} id - The ID of the training.
   * @returns {Promise<number>} A promise that resolves to the average rating.
   */
  async findAverageRatingOfTraining(id) {
    const result = await this.findAverageRatingOfTrainingLoader.load(id);
    return result || 0;
  }
}

export default Review;
