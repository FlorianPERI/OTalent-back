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
}

export default Member;
