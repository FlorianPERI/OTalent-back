import client from '../../services/client.js';

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

async function formatDates(data, tableName) {
  if (tableName === 'training' && 'startingDate' in data && 'endingDate' in data) {
    data.dates = [data.startingDate, data.endingDate];
    delete data.startingDate;
    delete data.endingDate;
    return data;
  }
}

export {
  isMember, isOrganization, isEmailInAnotherTable, isColumnInTable, formatDates,
};
