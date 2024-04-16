import Debug from 'debug';
import reviews from '../jsons/reviews.json' assert { type: 'json' };
import client from '../../app/graphql/dataSources/otalentDB/services/client.js';
import { getRandomInt } from './dataUtils.js';

const debug = Debug('data:json:reviews');

/**
* Imports reviews from a json file into the database
* @returns {Promise<Array>} - A promise resolved with an array
  containing the results of the insertion queries
*/
async function importReviewsFromJson(members, trainings) {
    debug('importing reviews from json');
    const inserts = [];
    for (let i = 0; i < trainings; i += 1) {
        const reviews = getRandomInt(0, 10); // Generate between 0 and 10 reviews per training
        for (let j = 0; j < reviews; j += 1) {
            const review = reviews[j % reviews.length];
            review.trainingId = i + 1;
            review.memberId = getRandomInt(1, members);
            const reviewJSON = JSON.stringify(review);
            const query = {
                text: 'SELECT * FROM insert_review($1);',
                values: [reviewJSON],
            };
            inserts.push(client.query(query));
        }
    }
    return Promise.all(inserts);
}

export default importReviewsFromJson;
