import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';

const debug = Debug('app:datasource:otalentDB:review');

class Review extends CoreDatamapper {
  tableName = 'review';

  async findByTrainingId(id) {
    debug(`find all reviews of training[${id}]`);
    const query = {
      text: 'SELECT * FROM review WHERE training_id = $1',
      values: [id],
    };
    const results = await this.client.query(query);
    return results.rows;
  }

  async findByMemberId(id) {
    debug(`find all reviews of member[${id}]`);
    const query = {
      text: 'SELECT * FROM review WHERE member_id = $1;',
      values: [id],
    };
    const results = await this.client.query(query);
    return results.rows;
  }

  async findAverageRatingOfTraining(id) {
    debug(`find average rating for training[${id}]`);
    const query = {
      text: 'SELECT AVG(rating) FROM review WHERE training_id = $1;',
      values: [id],
    };
    const results = await this.client.query(query);
    return results.rows[0].avg;
  }
}

export default Review;
