const debug = require('debug')('app:datasource:otalent:coredatamapper');
const DataLoader = require('dataloader');
const { createHash } = require('node:crypto');

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
}

export default CoreDatamapper;
