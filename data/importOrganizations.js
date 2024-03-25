import organizations from './organizations.json' assert {type: "json"};
import Debug from 'debug';
import 'dotenv/config';
import client from '../app/graphql/dataSources/otalentDB/services/client.js';
import { hashingPassword } from './utils/dataUtils.js';

const debug = Debug('data:json:organizations');

/**
 * Imports organizations from a json file into the database
 * @returns {Promise<Array>} - A promise resolved with an array containing the results of the insertion queries
 */
function importOrganizationsFromJSON() {
    debug('importing organizations from json');
    const inserts = [];
    organizations.forEach(async (organization) => {
        organization.password = await hashingPassword(organization.password);
        const query = {
            text: `SELECT * FROM insert_organization($1);`,
            values: [organization],
        };
        inserts.push(client.query(query));
    });
    return Promise.all(inserts);
}

export { importOrganizationsFromJSON };
































