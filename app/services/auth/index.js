import jwt from 'jsonwebtoken';

import client from '../../graphql/dataSources/otalentDB/services/client.js';

const auth = {
  /**
   * Verifies the validity of the provided JSON Web Token (JWT).
   * @param {string} token - The JWT to verify.
   * @returns {boolean} Indicates if the token is valid (true) or not (false).
   */
  verifyToken(token) {
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    return isValid;
  },

  /**
   * Retrieves the user information based on the information based on the decoded token.
   * @param {Object} decodedToken - The decoded JWT containing user information.
   * @returns {Promise<Object>}
   * @returns A promise that resolves with the user information retrieved from the database.
   */
  async getUser(decodedToken) {
    const { id } = decodedToken;
    const entity = decodedToken.member ? 'member' : 'organization';
    const query = {
      text: `SELECT '${entity}' as type, * FROM ${entity} WHERE id = $1;`,
      values: [id],
    };
    const response = await client.query(query);
    const user = response.rows[0];
    return user;
  },
};

export default auth;
