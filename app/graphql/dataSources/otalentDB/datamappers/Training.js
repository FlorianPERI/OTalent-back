import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';

const debug = Debug('app:datasource:otalentDB:training');

class Training extends CoreDatamapper {
  tableName = 'training';

  async findByMemberId(id) {
    debug(`finding all trainings of member[${id}]`);
    const query = {
      text: 'SELECT t.* FROM training t JOIN member_likes_training mlt ON mlt.training_id = t.id WHERE mlt.member_id = $1;',
      values: [id],
    };
    const results = await this.client.query(query);
    return results.rows;
  }

  async findByOrganizationId(id) {
    debug(`finding all trainings of organization[${id}]`);
    const query = {
      text: 'SELECT * FROM training WHERE organization_id = $1;',
      values: [id],
    };
    const results = await this.client.query(query);
    return results.rows;
  }

  async findByCategoryId(id) {
    debug(`finding all trainings of category[${id}]`);
    const query = {
      text: 'SELECT * FROM training WHERE category_id = $1;',
      values: [id],
    };
    const results = await this.client.query(query);
    return results.rows;
  }
}

export default Training;
