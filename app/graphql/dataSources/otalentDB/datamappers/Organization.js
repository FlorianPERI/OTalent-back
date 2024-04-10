import CoreDatamapper from './CoreDatamapper.js';
import regions from '../../../../../data/regions.json' assert {type: "json"};
import { getRegion } from './utils/datamapperUtils.js';

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

  async findOrganizationsByRegion(postalCode) {
    const memberRegion = getRegion(postalCode);
    let organizationsByRegion = [];
    const query = {
      text: `SELECT * FROM ${this.tableName};`,
    };
    const result = await this.client.query(query);
    const organizations = result.rows;
    organizations.forEach(organization => {
      const organizationRegion = getRegion(organization.postal_code);      
      if (organizationRegion === memberRegion) {
        organizationsByRegion.push(organization);
      }
    })
    return organizationsByRegion;
  }
}

export default Organization;
