import Debug from 'debug';
import DataLoader from 'dataloader';
import CoreDatamapper from './CoreDatamapper.js';

const debug = Debug('app:datasource:otalentDB:training');

class Training extends CoreDatamapper {
  tableName = 'training';

  constructor(options) {
    super(options);

    this.findByMemberIdsLoader = new DataLoader(async (ids) => {
      debug(`find all trainings for members [${ids}]`);
      const query = {
        text: 'SELECT t.* FROM training t JOIN member_likes_training mlt ON mlt.training_id = t.id WHERE mlt.member_id = ANY($1);',
        values: [ids],
      };
      const results = await this.client.query(query);
      return ids.map((id) => results.rows.filter((row) => row.id === id));
    });
    this.findByOrganizationIdsLoader = new DataLoader(async (ids) => {
      debug(`find all trainings for organization [${ids}]`);
      const query = {
        text: 'SELECT * FROM training WHERE organization_id = ANY($1);',
        values: [ids],
      };
      const results = await this.client.query(query);
      return ids.map((id) => results.rows.filter((row) => row.id === id));
    });
    this.findByCategoryIdsLoader = new DataLoader(async (ids) => {
      debug(`find all trainings for category [${ids}]`);
      const query = {
        text: 'SELECT * FROM training WHERE category_id = ANY($1);',
        values: [ids],
      };
      const results = await this.client.query(query);
      return ids.map((id) => results.rows.filter((row) => row.id === id));
    });
  }

  async findByMemberId(id) {
    const result = await this.findByMemberIdsLoader.load(id);
    return result || [];
  }

  async findByOrganizationId(id) {
    const result = await this.findByMemberIdsLoader.load(id);
    return result || [];
  }

  async findByCategoryId(id) {
    const result = await this.findByMemberIdsLoader.load(id);
    return result || [];
  }
}

export default Training;
