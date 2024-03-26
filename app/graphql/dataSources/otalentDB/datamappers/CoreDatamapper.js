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
import { createHash } from 'node:crypto';

const debug = Debug('app:otalentDB:core');

/**
 * Represents a CoreDatamapper.
 * @class
 */
class CoreDatamapper {
  tableName;

  /**
   * Creates an instance of CoreDatamapper.
   * @param {object} options - The options object.
   * @param {object} options.client - The database client.
   */
  constructor(options) {
    this.client = options.client;
    this.cache = options.cache;

    /**
     * DataLoader instance for batch loading data by primary key.
     * @type {DataLoader}
     */
    this.findByPkLoader = new DataLoader(async (ids) => {
      debug(`finding all ${this.tableName} with ids [${ids}]`);
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE id = ANY($1)`,
        values: [ids],
      };
      // debug(query);
      const rows = await this.cacheQuery(query);
      return ids.map((id) => rows.find((row) => row.id === id));
    });
  }

  /**
   * Creates a DataLoader instance for batch loading data by entity ID.
   * @param {string} entityName - The name of the entity.
   * @param {string} idField - The ID field of the entity.
   */
  createDataLoader(entityName, idField) {
    const lowerCaseEntityName = entityName.toLowerCase();
    this[`findBy${entityName}IdLoader`] = new DataLoader(async (ids) => {
      debug(`finding all ${this.tableName} by ${lowerCaseEntityName} with ids [${ids}]`);
      const query = {
        text: `SELECT * FROM ${this.tableName} WHERE ${idField} = ANY($1);`,
        values: [ids],
      };
      debug(query);
      const rows = await this.cacheQuery(query);
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
  createDataLoaderWithJoin(entityName, joinTableName, condition, idField) {
    const lowerCaseEntityName = entityName.toLowerCase();
    this[`findBy${entityName}IdLoader`] = new DataLoader(async (ids) => {
      debug(`finding all ${this.tableName} using ${joinTableName} with ${lowerCaseEntityName} ids [${ids}]`);
      const query = {
        text: `SELECT * FROM ${this.tableName} JOIN ${joinTableName} ON ${joinTableName}.${condition} = ${this.tableName}.id WHERE ${joinTableName}.${idField} = ANY($1);`,
        values: [ids],
      };
      // debug(query);
      const rows = await this.cacheQuery(query);
      return ids.map((id) => rows.filter((row) => row[idField] === id));
    });
  }

  /**
   * Creates association methods for the entity.
   * @param {string} entityName - The name of the entity.
   * @param {string} tableName - The name of the association table.
   */
  createAssociationMethods(entityName, tableName) {
    const lowerCaseEntityName = entityName.toLowerCase();
    /**
     * Associates two entities.
     * @param {number} id1 - The ID of the first entity.
     * @param {number} id2 - The ID of the second entity.
     * @returns {boolean} - Returns true if the association is successful, false otherwise.
     */
    this[`associate${entityName}`] = async (id1, id2) => {
      debug(`associating ${this.tableName}[${id1}] and ${lowerCaseEntityName}[${id2}]`);
      const query = {
        text: `INSERT INTO ${tableName} (${this.tableName}_id, ${lowerCaseEntityName}_id) VALUES ($1, $2);`,
        values: [id1, id2],
      };
      const results = await this.cacheQuery(query);
      return !!results.rowCount;
    };

    /**
     * Dissociates two entities.
     * @param {number} id1 - The ID of the first entity.
     * @param {number} id2 - The ID of the second entity.
     * @returns {boolean} - Returns true if the dissociation is successful, false otherwise.
     */
    this[`dissociate${entityName}`] = async (id1, id2) => {
      debug(`dissociating ${this.tableName}[${id1}] and ${lowerCaseEntityName}[${id2}]`);
      const query = {
        text: `DELETE FROM ${tableName} WHERE ${this.tableName}_id = $1 AND ${lowerCaseEntityName}_id = $2;`,
        values: [id1, id2],
      };
      const results = await this.client.query(query);
      return !!results.rowCount;
    };
  }

  /**
   * Creates a DataLoader instance for batch loading average ratings of an entity.
   * @param {string} entityName - The name of the entity.
   * @param {string} tableName - The name of the table.
   * @param {string} idField - The ID field of the entity.
   */
  createAverageRatingDataLoader(entityName, tableName, idField) {
    /**
     * Finds the average ratings of the entity.
     * @param {number[]} ids - The IDs of the entities.
     * @returns {number[]} - Returns an array of average ratings.
     */
    this[`findAverageRatingOf${entityName}Loader`] = new DataLoader(async (ids) => {
      debug(`find average ratings for ${entityName.toLowerCase()} [${ids}]`);
      const query = {
        text: `SELECT ${idField}, COALESCE(AVG(rating), 0)::numeric(10,2) AS avg FROM ${tableName} WHERE ${idField} = ANY($1) GROUP BY ${idField};`,
        values: [ids],
      };
      const rows = await this.cacheQuery(query);
      return ids.map((id) => parseFloat(rows.find((row) => row[idField] === id)?.avg || 0));
    });
  }

  /**
   * Finds all entities.
   * @returns {object[]} - Returns an array of entities.
   */
  async findAll() {
    debug(`requesting all ${this.tableName}s`);
    const query = {
      text: `SELECT * FROM ${this.tableName}`,
    };
    const rows = await this.cacheQuery(query);
    return rows;
  }

  /**
   * Finds an entity by its primary key.
   * @param {number} id - The ID of the entity.
   * @returns {object} - Returns the entity object.
   */
  async findByPk(id) {
    return this.findByPkLoader.load(parseInt(id, 10));
  }

  /**
   * Inserts a new entity.
   * @param {object} data - The data of the entity.
   * @returns {object} - Returns the inserted entity object.
   */
  async insert(data) {
    debug(data);
    debug(`adding new ${this.tableName}`);
    const query = {
      text: `SELECT * FROM insert_${this.tableName}($1);`,
      values: [data.input],
    };
    const result = await this.client.query(query);
    return result.rows[0];
  }

  /**
   * Updates an entity.
   * @param {object} data - The data of the entity.
   * @returns {object} - Returns the inserted entity object.
   */
  async update(id, data) {
    debug(`updating ${this.tableName} [${id}]`);
    const keys = Object.keys(data.input);
    const values = Object.values(data.input);
    const setString = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const query = {
      text: `UPDATE ${this.tableName} SET ${setString}, updated_at = now() WHERE id = $${values.length + 1} RETURNING *;`,
      values: [...values, id],
    };
    debug(query);
    const result = await this.client.query(query);
    return result.rows[0];
  }

  /**
   * Deletes an entity by its ID.
   * @param {number} id - The ID of the entity.
   * @returns {boolean} - Returns true if the deletion is successful, false otherwise.
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

  /**
   * Caches the result of a query.
   * @param {object} query - The query object.
   * @param {number} ttl - The time-to-live (TTL) of the cache in seconds.
   * @returns {object[]} - Returns the query results.
   */
  async cacheQuery(query, ttl) {
    const cacheKey = createHash('sha1').update(JSON.stringify(query)).digest('base64');
    const cachedValue = await this.cache.get(cacheKey);
    if (cachedValue) {
      debug('cached value found, returning it');
      return JSON.parse(cachedValue);
    }
    debug(`no cached value found for ${cacheKey}`);
    const results = await this.client.query(query);
    const data = results.rows || [];
    debug('value added to cache');
    this.cache.set(cacheKey, JSON.stringify(data), { ttl });
    return data;
  }
}

export default CoreDatamapper;
