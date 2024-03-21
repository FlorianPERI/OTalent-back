import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';

const debug = Debug('app:datasource:otalentDB:member');

class Member extends CoreDatamapper {
  tableName = 'member';

  constructor(options) {
    super(options);
    debug('member datamapper created');
  }

  async findByTrainingId(id) {
    debug(`find all members interested by training[${id}]`);
    const query = {
      text: 'SELECT m.* FROM member m JOIN member_likes_training mlt ON mlt.member_id = m.id WHERE mlt.training_id = $1;',
      values: [id],
    };
    const results = await this.client.query(query);
    return results.rows;
  }

  async findByCategoryId(id) {
    debug(`finding all members interested by category[${id}]`);
    const query = {
      text: 'SELECT m.* FROM member m JOIN member_likes_category mlc ON mlc.member_id = m.id WHERE mlc.category_id = $1;',
      values: [id],
    };
    const results = await this.client.query(query);
    return results.rows;
  }

  async associateMemberCategory(memberId, categoryId) {
    debug(`associating member[${memberId}] and category[${categoryId}]`);
    const query = {
      text: 'INSERT INTO member_likes_category (member_id, category_id) VALUES ($1, $2);',
      values: [memberId, categoryId],
    };
    const results = await this.client.query(query);
    return !!results.rowCount;
  }

  async dissociateMemberCategory(memberId, categoryId) {
    debug(`dissociating member[${memberId}] and category[${categoryId}]`);
    const query = {
      text: 'DELETE FROM member_likes_category WHERE member_id = $1 AND category_id = $2;',
      values: [memberId, categoryId],
    };
    const results = await this.client.query(query);
    return !!results.rowCount;
  }

  async associateMemberTraining(memberId, trainingId) {
    debug(`associating member[${memberId}] and training[${trainingId}]`);
    const query = {
      text: 'INSERT INTO member_likes_training (member_id, training_id) VALUES ($1, $2);',
      values: [memberId, trainingId],
    };
    const results = await this.client.query(query);
    return !!results.rowCount;
  }

  async dissociateMemberTraining(memberId, trainingId) {
    debug(`dissociating member[${memberId}] and training[${trainingId}]`);
    const query = {
      text: 'DELETE FROM member_likes_training WHERE member_id = $1 AND training_id = $2;',
      values: [memberId, trainingId],
    };
    const results = await this.client.query(query);
    return !!results.rowCount;
  }
}

export default Member;
