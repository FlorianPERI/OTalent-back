import DataLoader from 'dataloader';
import Debug from 'debug';

const debug = Debug('app:datasource:coredatamapper');
class CoreDatamapper {
  tableName;

  constructor(options) {
    this.client = options.client;

    this.findByPkLoader = new DataLoader(async (ids) => {
      debug(`requesting ${this.tableName}s with ids [${ids}]`);
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE id = ANY($1)`,
        values: [ids],
      };
      const results = await this.client.query(query);
      return ids.map((id) => results.rows.find((row) => row.id === id));
    });
  }

  async findAll() {
    debug(`requesting all ${this.tableName}`);
    const query = {
      text: `SELECT * FROM ${this.tableName}`,
    };
    const results = await this.client.query(query);
    return results.rows;
  }

  async findByPk(id) {
    return this.findByPkLoader.load(parseInt(id, 10));
  }

  async delete(id) {
    debug(`deleting ${this.tableName}[${id}]`);
    const query = {
      text: `DELETE FROM ${this.tableName} WHERE id = $1;`,
      values: [id],
    };
    const result = await this.client.query(query);
    return !!result.rowCount;
  }

  async insert(data) {
    debug(`adding new ${this.tableName}`);
    const query = {
      text: `SELECT * FROM insert_${this.tableName}($1);`,
      values: [data.input],
    };
    const result = await this.client.query(query);
    return result.rows[0];
  }
}

export default CoreDatamapper;
