import Debug from 'debug';
import DataLoader from 'dataloader';
import CoreDatamapper from './CoreDatamapper.js';

const debug = Debug('app:datasource:otalentDB:review');

class Review extends CoreDatamapper {
  tableName = 'review';

  constructor(options) {
    super(options);

    this.findByTrainingIdLoader = new DataLoader(async (ids) => {
      debug(`find all reviews for trainings [${ids}]`);
      const query = {
        text: 'SELECT * FROM review WHERE training_id = ANY($1)',
        values: [ids],
      };
      const results = await this.client.query(query);
      return results.rows;
    });

    this.findByMemberIdLoader = new DataLoader(async (ids) => {
      debug(`find all reviews for members [${ids}]`);
      const query = {
        text: 'SELECT * FROM review WHERE member_id = ANY($1);',
        values: [ids],
      };
      const results = await this.client.query(query);
      return results.rows;
    });

    this.findAverageRatingOfTrainingLoader = new DataLoader(async (ids) => {
      debug(`find average ratings for trainings [${ids}]`);
      const query = {
        text: 'SELECT AVG(rating) FROM review WHERE training_id = ANY($1);',
        values: [ids],
      };
      const results = await this.client.query(query);
      return results.rows[0].avg;
    });
  }

  async findByTrainingId(id) {
    const result = await this.findByTrainingIdsLoader.load(id);
    return result || [];
  }

  async findByMemberId(id) {
    const result = await this.findByMemberIdsLoader.load(id);
    return result || [];
  }

  async findAverageRatingOfTraining(id) {
    const result = await this.findAverageRatingOfTrainingLoader.load(id);
    return result || [];
  }
}

export default Review;
