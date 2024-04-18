import Debug from 'debug';
import members from '../jsons/members.json' with { type: 'json' };
import client from '../../app/graphql/dataSources/otalentDB/services/client.js';
import { hashingPassword } from './dataUtils.js';

const debug = Debug('data:json:members');

/**
 * Imports members from a json file into the database
 * @returns {Promise<Array>} - A promise resolved with an array
 * containing the results of the insertion queries
 */
async function importMembersFromJson() {
  debug('importing members from json');
  const inserts = members.map(async (member) => {
    const hashedPassword = await hashingPassword(member.password);
    const updatedMember = { ...member, password: hashedPassword };
    const query = {
      text: 'SELECT * FROM insert_member($1);',
      values: [updatedMember],
    };
    return client.query(query);
  });
  return Promise.all(inserts);
}

export default importMembersFromJson;
