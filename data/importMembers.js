import members from './members.json' assert {type: "json"};
import Debug from 'debug';
import 'dotenv/config';
import client from '../app/graphql/dataSources/otalentDB/services/client.js';
import { hashingPassword } from './utils/dataUtils.js';

const debug = Debug('data:json:members');

/**
 * Imports members from a json file into the database
 * @returns {Promise<Array>} - A promise resolved with an array containing the results of the insertion queries
 */
async function importMembersFromJSON() {
    debug('importing members from json');
    const inserts = [];
    for (const member of members) {
        member.password = await hashingPassword(member.password);
        const query = {
            text: `SELECT * FROM insert_member($1);`,
            values: [member],
        };
        inserts.push(client.query(query));
    };
    return Promise.all(inserts);
}

export { importMembersFromJSON };

