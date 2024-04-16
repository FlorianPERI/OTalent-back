import Debug from 'debug';
import client from '../../app/graphql/dataSources/otalentDB/services/client.js';
import categories from '../jsons/categories.json' assert { type: 'json' };

const debug = Debug('data:json:categories');

/**
 * Imports all categories from the json into the database
 * @params {number} categories - Categories to import.
 * @returns {Promise<Array>}
 */
function importCategoriesFromJson() {
    debug('importing categories');
    const inserts = [];
    categories.label.forEach(category => {
        const query = {
            text: 'INSERT INTO category (label) VALUES ($1);',
            values: [category],
        };
        inserts.push(client.query(query));
    });
    return Promise.all(inserts);
}

export default importCategoriesFromJson;
