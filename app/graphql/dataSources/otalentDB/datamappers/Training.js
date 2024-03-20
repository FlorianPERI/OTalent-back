import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';
import { da } from '@faker-js/faker';

const debug = Debug('app:datasource:otalentDB:training');

class Training extends CoreDatamapper {
  tableName = 'training';

  constructor(options) {
    super(options);
    debug('training datamapper created');
  }

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

}

export default Training;
