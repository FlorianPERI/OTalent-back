import Debug from 'debug';
import 'dotenv/config';
import client from '../app/graphql/dataSources/otalentDB/services/client.js';
import trainings from './trainings.json' assert {type: "json"};


const debug = Debug('data:json:trainings');

/**
 * Imports trainings from a json file into the database
 * @returns {Promise<Array>} - A promise resolved with an array containing the results of the insertion queries
 */
function importTrainingsFromJSON() {
    debug('importing trainings from json');
    const inserts = [];
    const fields = Object.keys(trainings[0]);
    const placeholders = [];
    fields.forEach((field, index) => {
        placeholders.push(`$${index + 1}`);
    });
    trainings.forEach((training) => {
        const values = [];
        training.duration = training.duration * 35;
        training.prerequisites = JSON.stringify(training.prerequisites.split());
        training.program = JSON.stringify(training.program.split(','));
        Object.values(training).forEach((value) => values.push(value));
        const query = {
            text: `INSERT INTO training (${fields}) VALUES (${placeholders});`,
            values,
        };
        inserts.push(client.query(query));
    });
    return Promise.all(inserts);
}


export { importTrainingsFromJSON };
