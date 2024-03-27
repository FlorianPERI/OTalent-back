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
  if (response.rows[0]) {
    return true;
  }
  return false;
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
  if (response.rows[0]) {
    return true;
  }
  return false;
}

export { isMember, isOrganization };
