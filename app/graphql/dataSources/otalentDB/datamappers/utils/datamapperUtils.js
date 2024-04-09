import client from '../../services/client.js';
import regions from '../../../../../../data/regions.json' assert {type: "json"};
/**
 * Checks if the given email belongs to a member.
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>}
 * A promise that resolves to true if the email belongs to a member, otherwise false.
 */
async function isMember(email) {
  const query = {
    text: 'SELECT * FROM member WHERE email = $1;',
    values: [email],
  };
  const response = await client.query(query);
  return !!response.rows[0];
}

/**
 * Checks if the given email belongs to an organization.
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>}
 * A promise that resolves to true if the email belongs to an organization, otherwise false.
 */
async function isOrganization(email) {
  const query = {
    text: 'SELECT * FROM organization WHERE email = $1;',
    values: [email],
  };
  const response = await client.query(query);
  return !!response.rows[0];
}

/**
 * Checks if the specified email exists in another table.
 * @param {string} email - The email to check.
 * @param {string} tableToCheck - The name of the table to check.
 * @returns {Promise<boolean>}
 * A promise that resolves to true if the email exists in the specified table, otherwise false.
 */
async function isEmailInAnotherTable(email, tableToCheck) {
  const query = {
    text: `SELECT * FROM ${tableToCheck} WHERE email = $1;`,
    values: [email],
  };
  const response = await client.query(query);
  return !!response.rows[0];
}

/**
 * Checks if a column exists in a given table.
 * @param {string} columnName - The name of the column to check.
 * @param {string} tableName - The name of the table to check the column in.
 * @returns {Promise<boolean>}
 * @returns A promise that resolves with a boolean indicating if the column exists in the tables.
 */
async function isColumnInTable(columnName, tableName) {
  const query = {
    text: `SELECT column_name FROM information_schema.columns
          WHERE table_name = $1 AND column_name = $2;`,
    values: [tableName, columnName],
  };
  const response = await client.query(query);
  return !!response.rowCount;
}

/**
 * Formats dates in the provided data object based on the specified table name.
 * @param {Object} data - The data object containing date properties to be formatted.
 * @param {string} tableName - The name of the table associated with the data
 * @returns {Object|null} The formatted data object with dates transformed into an array,
 * or null if the table name does not match 'training' or date properties are missing.
 */
async function formatDates(data, tableName) {
  if (tableName === 'training' && 'startingDate' in data && 'endingDate' in data) {
    data.dates = [data.startingDate, data.endingDate];
    delete data.startingDate;
    delete data.endingDate;
    return data;
  }
}

/**
 * Retrieves the name of the region based on the provided postal code.
 * This function searches through a predefined list of regions and their associated departments.
 * @param {string} postalCode - The postal code used to determine the region.
 * @returns {string|null} The name of the region corresponding to the provided postal code,
 * or null if no matching region is found for the given postal code.
 */
function getRegion(postalCode) {
  const departmentCode = postalCode.substring(0, 2);
  let regionName = null;
  regions.forEach((region) => {
    const departement = region.departements.find((dep) => dep.code === departmentCode)
    if (departement) {
      regionName = region.name;
      return;
    }
  });
  return regionName;
}

export {
  isMember, isOrganization, isEmailInAnotherTable, isColumnInTable, formatDates, getRegion
};
