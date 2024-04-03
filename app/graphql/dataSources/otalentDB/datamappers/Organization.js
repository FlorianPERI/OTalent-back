import CoreDatamapper from './CoreDatamapper.js';

/**
 * Represents an Organization datamapper.
 * @extends CoreDatamapper
 */
class Organization extends CoreDatamapper {
  tableName = 'organization';

  async findOrganizationsByMemberPostalCode(postalCode) {
    const department = postalCode.substring(0, 2);
    const query = {
      text: `SELECT * FROM ${this.tableName} WHERE postal_code LIKE '${department}%'`,
    };
    const result = await this.client.query(query);
    return result.rows;
  }
}

export default Organization;
