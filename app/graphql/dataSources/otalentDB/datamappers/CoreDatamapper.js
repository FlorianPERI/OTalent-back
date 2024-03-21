import { log } from 'console';
import Debug from 'debug';

const debug = Debug('app:datasource:coredatamapper');
class CoreDatamapper {
  tableName;

  constructor(options) {
    this.client = options.client;
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
    debug(`requesting ${this.tableName} with id [${id}]`);
    const query = {
      text: `SELECT * FROM ${this.tableName} WHERE id = $1`,
      values: [id],
    };
    const result = await this.client.query(query);
    return result.rows[0];
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
    // const fields = [];


    Object.entries(data.input).forEach(([prop, value]) => {
      console.log(value);
    });
    const query = {
      text: `SELECT * FROM insert_${this.tableName}($1);`,
      values: [data.input],
    };
    console.log(query);
    const result = await this.client.query(query);
    return result.rows[0];
  }
}

export default CoreDatamapper;
