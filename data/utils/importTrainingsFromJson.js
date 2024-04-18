import Debug from 'debug';
import client from '../../app/graphql/dataSources/otalentDB/services/client.js';
import trainings from '../jsons/trainings.json' assert { type: 'json' };

const debug = Debug('data:json:trainings');

/**
 * Imports trainings from a json file into the database
 * @returns {Promise<Array>} - A promise resolved with an array
 * containing the results of the insertion queries
 */
function importTrainingsFromJson() {
    debug('importing trainings from json');
    const inserts = [];
    const fields = Object.keys(trainings[0]);
    const placeholders = [];
    fields.forEach((_, index) => {
        placeholders.push(`$${index + 1}`);
    });
    trainings.forEach(originalTraining => {
        const training = { ...originalTraining };
        const values = [];
        training.duration *= 35;
        training.prerequisites = JSON.stringify(
            training.prerequisites.split(',')
        );
        training.program = JSON.stringify(training.program.split(','));
        values.push(...Object.values(training));
        const query = {
            text: `INSERT INTO training (${fields.join(
                ', '
            )}) VALUES (${placeholders.join(', ')});`,
            values,
        };
        inserts.push(client.query(query));
    });
    return Promise.all(inserts);
}

export default importTrainingsFromJson;
