/**
 * This file contains the implementation of the CoreDatamapper class.
 * The CoreDatamapper class is responsible for handling
 * data operations for a specific table in the database.
 * It provides methods for querying, inserting, deleting, and associating data.
 * @file CoreDatamapper.js
 * @exports CoreDatamapper
 */
import DataLoader from 'dataloader';
import Debug from 'debug';
import accountUtils from './utils/accountUtils.js';


const debug = Debug('app:otalentDB:core');

/**
 * Represents a CoreDatamapper.
 * @class
 */
class CoreDatamapper {
  /**
   * Creates an instance of CoreDatamapper.
   * @param {object} options - The options for CoreDatamapper.
   * @param {object} options.client - The database client.
   * @param {object} options.cache - The cache.
   */
  constructor(options) {
    this.client = options.client;
    this.cache = options.cache;
    this.findByPkLoader = new DataLoader(async (ids) => {
      debug(`finding all ${this.tableName} with ids [${ids}]`);
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE id = ANY($1)`,
        values: [ids],
      };
      // debug(query);
      const result = await this.client.query(query);
      const { rows } = result;
      return ids.map((id) => rows.find((row) => row.id === id));
    });
  }

  /** *************************************************************************************
   *
   *                              CRUD Methods
   *
   ************************************************************************************** */

  /**
   * Finds all entities.
   * @returns {Promise<object[]>} - Returns a promise that resolves to an array of entities.
   */
  async findAll() {
    debug(`requesting all ${this.tableName}s`);
    const query = {
      text: `SELECT * FROM ${this.tableName}`,
    };
    const results = await this.client.query(query);
    return results.rows;
  }

  /**
   * Finds an entity by its primary key.
   * @param {number} id - The ID of the entity.
   * @returns {Promise<object>} - Returns a promise that resolves to the entity object.
   */
  async findByPk(id) {
    return this.findByPkLoader.load(parseInt(id, 10));
  }

  /**
   * Inserts a new entity.
   * @param {object} data - The data of the entity.
   * @returns {Promise<object>} - Returns a promise that resolves to the inserted entity object.
   * @throws {Error} - Throws an error if the email is already used in another table.
   */
  async insert(data) {
    debug(data);
    debug(`adding new ${this.tableName}`);

    await accountUtils.checkEmailUniqueness(data, this.tableName);
    const modifiedData = await accountUtils.hashPasswordIfNeeded(data, this.tableName);

    const query = {
      text: `SELECT * FROM insert_${this.tableName}($1);`,
      values: [modifiedData.input],
    };
    const result = await this.client.query(query);
    return result.rows[0];
  }

  /**
   * Updates an entity.
   * @param {number} id - The ID of the entity.
   * @param {object} data - The updated data of the entity.
   * @returns {Promise<object>} - Returns a promise that resolves to the updated entity object.
   */
  async update(id, data) {
    debug(`updating ${this.tableName} [${id}]`);
    const modifiedData = await accountUtils.hashPasswordIfNeeded(data, this.tableName);
    const values = Object.values(modifiedData.input);
    const keys = Object.keys(modifiedData.input);
    const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const query = {
      text: `UPDATE ${this.tableName} SET ${setString}, updated_at = now() WHERE id = $${values.length + 1} RETURNING *;`,
      values: [...values, id],
    };
    const result = await this.client.query(query);
    return result.rows[0];
  }

  /**
   * Deletes an entity.
   * @param {number} id - The ID of the entity.
   * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating
   * if the entity was deleted successfully.
   */
  async delete(id) {
    debug(`deleting ${this.tableName} [${id}]`);
    const query = {
      text: `DELETE FROM ${this.tableName} WHERE id = $1;`,
      values: [id],
    };
    const result = await this.client.query(query);
    return !!result.rowCount;
  }

  /** *************************************************************************************
   *
   *                              Dataloader Methods
   *
   ************************************************************************************** */

  /**
   * Creates a base DataLoader instance for batch loading data.
   * @param {string} entityName - The name of the entity.
   * @param {string} idField - The ID field of the entity.
   * @param {function} buildQuery - The function to build the query for batch loading.
   * @returns {DataLoader} - Returns a DataLoader instance.
   */
  byEntityIdDataLoader(entityName, idField) {
    const lowerCaseEntityName = entityName.toLowerCase();
    this[`findBy${entityName}IdLoader`] = new DataLoader(async (ids) => {
      debug(`finding all ${this.tableName} by ${lowerCaseEntityName} with ids [${ids}]`);
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE ${idField} = ANY($1);`,
        values: [ids],
      };
      debug(query);
      const result = await this.client.query(query);
      const { rows } = result;
      return ids.map((id) => rows.filter((row) => row[idField] === id));
    });
  }

  /**
   * Creates a DataLoader instance for batch loading data with join.
   * @param {string} entityName - The name of the entity.
   * @param {string} joinTableName - The name of the join table.
   * @param {string} condition - The join condition.
   * @param {string} idField - The ID field of the entity.
   */
  joinDataLoader(entityName, joinTableName, condition, idField) {
    const lowerCaseEntityName = entityName.toLowerCase();
    this[`findBy${entityName}IdLoader`] = new DataLoader(async (ids) => {
      debug(`finding all ${this.tableName} using ${joinTableName} with ${lowerCaseEntityName} ids [${ids}]`);
      const query = {
        text: `SELECT ${this.tableName}.*, ${joinTableName}.${lowerCaseEntityName}_id FROM ${this.tableName} JOIN ${joinTableName} ON ${joinTableName}.${condition} = ${this.tableName}.id WHERE ${joinTableName}.${idField} = ANY($1);`,
        values: [ids],
      };
      debug(query);
      const result = await this.client.query(query);
      const { rows } = result;
      return ids.map((id) => rows.filter((row) => row[idField] === id));
    });
  }

  /**
   * Creates a DataLoader instance for batch loading average ratings of an entity.
   * @param {string} entityName - The name of the entity.
   * @param {string} tableName - The name of the table.
   * @param {string} idField - The ID field of the entity.
   */

  avgRatingDataLoader(entityName, tableName, idField) {
    this[`findAverageRatingOf${entityName}Loader`] = new DataLoader(async (ids) => {
      debug(`find average ratings for ${entityName.toLowerCase()} [${ids}]`);
      const query = {
        text: `SELECT ${idField}, COALESCE(AVG(rating), 0)::numeric(10,2) AS avg FROM ${tableName} WHERE ${idField} = ANY($1) GROUP BY ${idField};`,
        values: [ids],
      };
      const result = await this.client.query(query);
      const { rows } = result;
      return ids.map((id) => parseFloat(rows.find((row) => row[idField] === id)?.avg || 0));
    });
  }

  /** *************************************************************************************
   *
   *                              Association Methods
   *
   ************************************************************************************** */

  /**
   * Creates association methods between two entities.
   * @param {string} entityName - The name of the first entity.
   * @param {string} tableName - The name of the association table.
   */
  createAssociationMethods(entityName, tableName) {
    const lowerCaseEntityName = entityName.toLowerCase();
    const lowerCaseTableName = tableName.toLowerCase();
    const buildQuery = (action, id1, id2) => {
      const queryText = action === 'associate'
        ? `INSERT INTO ${this.tableName}_likes_${lowerCaseTableName} (${this.tableName}_id, ${lowerCaseTableName}_id) VALUES ($1, $2);`
        : `DELETE FROM ${this.tableName}_likes_${lowerCaseTableName} WHERE ${this.tableName}_id = $1 AND ${lowerCaseTableName}_id = $2;`;
      return {
        text: queryText,
        values: [id1, id2],
      };
    };
    const executeAssociation = async (action, id1, id2) => {
      debug(`${action} ${this.tableName}[${id1}] and ${lowerCaseEntityName}[${id2}]`);
      const query = buildQuery(action, id1, id2);
      debug(query);
      const results = await this.client.query(query);
      return !!results.rowCount;

    };

    this[`associate${entityName}${tableName}`] = executeAssociation.bind(this, 'associate');
    this[`dissociate${entityName}${tableName}`] = executeAssociation.bind(this, 'dissociate');
  }
}

export default CoreDatamapper;
