import CoreDatamapper from './CoreDatamapper.js';
import { getRegion } from './utils/datamapperUtils.js';

/**
 * Represents an Organization datamapper.
 * @extends CoreDatamapper
 */
class Organization extends CoreDatamapper {
  tableName = 'organization';

  /**
     * Finds organizations by member postal code.
     * @param {string} postalCode - The postal code of the member.
     */
  async findOrganizationsByMemberPostalCode(postalCode) {
    const department = postalCode.substring(0, 2);
    const query = {
      text: `SELECT * FROM ${this.tableName} WHERE postal_code LIKE '${department}%'`,
    };
    const result = await this.client.query(query);
    return result.rows;
  }

  /**
     *  Finds organizations by region.
     * @param {string} postalCode - The postal code of the member.
     */
  async findOrganizationsByRegion(postalCode) {
    const memberRegion = getRegion(postalCode);
    const organizationsByRegion = [];
    const query = {
      text: `SELECT * FROM ${this.tableName};`,
    };
    const result = await this.client.query(query);
    const organizations = result.rows;
    organizations.forEach((organization) => {
      const organizationRegion = getRegion(organization.postal_code);
      if (organizationRegion === memberRegion) {
        organizationsByRegion.push(organization);
      }
    });
    return organizationsByRegion;
  }
}

export default Organization;
