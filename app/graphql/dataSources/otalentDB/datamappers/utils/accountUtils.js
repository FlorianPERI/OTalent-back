import bcrypt from 'bcrypt';
import client from '../../services/client.js';

/**
 * Utility functions related to account operations.
 * @namespace accountUtils
 */

const accountUtils = {

  /**
 * Checks if the specified email exists in another table.
 * @memberof accountUtils
 * @async
 * @param {string} email - The email to check.
 * @param {string} tableToCheck - The name of the table to check.
 * @returns {Promise<boolean>}
 * A promise that resolves to true if the email exists in the specified table, otherwise false.
 */
  async isEmailInAnotherTable(email, tableToCheck) {
    const query = {
      text: `SELECT * FROM ${tableToCheck} WHERE email = $1;`,
      values: [email],
    };
    const response = await client.query(query);
    return !!response.rows[0];
  },

  /**
 * Checks the uniqueness of an email in a specific table.
 * @memberof accountUtils
 * @async
 * @param {object} data - The data object containing the input.
 * @param {string} tableName - The name of the table to check.
 * @throws {Error} Throws an error if the email is already used in another table.
 */
  async checkEmailUniqueness(data, tableName) {
    let tableNameToCheck = null;
    if (tableName === 'organization') {
      tableNameToCheck = 'member';
    } else if (tableName === 'member') {
      tableNameToCheck = 'organization';
    }

    if (tableNameToCheck && await this.isEmailInAnotherTable(data.input.email, tableNameToCheck)) {
      throw new Error('This email is already used');
    }
  },

  /**
 * Hashes the password if needed for member or organization tables.
 * @memberof accountUtils
 * @async
 * @param {object} data - The data object containing the input.
 * @param {string} tableName - The name of the table.
 * @returns {object} The updated data object with the hashed password.
 */
  async hashPasswordIfNeeded(data, tableName) {
    if ((tableName === 'member' || tableName === 'organization') && data.input.password) {
      const hashedPassword = await bcrypt.hash(
        data.input.password,
        parseInt(process.env.PASSWORD_SALT, 10) || 10,
      );
      const updatedData = Object.assign(data.input, { password: hashedPassword });
      return updatedData;
    }
    return data;
  },
};

export default accountUtils;
