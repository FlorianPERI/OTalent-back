import Debug from 'debug';
import organizations from '../jsons/organizations.json' with { type: 'json' };
import client from '../../app/graphql/dataSources/otalentDB/services/client.js';
import { hashingPassword } from './dataUtils.js';

const debug = Debug('data:json:organizations');

/**
 * Imports organizations from a json file into the database
 * @returns {Promise<Array>} - A promise resolved with an array
 * containing the results of the insertion queries
 */
async function importOrganizationsFromJson() {
    debug('importing organizations from json');
    const inserts = [];
    for (const organization of organizations) {
        organization.password = await hashingPassword(organization.password);
        const query = {
            text: `SELECT * FROM insert_organization($1);`,
            values: [organization],
        };
        inserts.push(client.query(query));
    };
    return Promise.all(inserts);
}

export default importOrganizationsFromJson;
