import reviews from './reviews.json' assert {type: "json"};
import Debug from 'debug';
import 'dotenv/config';
import client from '../app/graphql/dataSources/otalentDB/services/client.js';
import { getRandomInt } from './utils/dataUtils.js';

const debug = Debug('data:json:reviews');

/**
* Imports reviews from a json file into the database
* @returns {Promise<Array>} - A promise resolved with an array containing the results of the insertion queries
*/
async function importReviewsFromJSON(NB_MEMBERS, NB_TRAININGS) {
  debug('importing reviews from json');
  const inserts = [];
  for (let i = 0; i < NB_TRAININGS; i++) {
    const NB_REVIEWS = getRandomInt(0, 10); // Generate between 0 and 10 reviews per training
    for (let j = 0; j < NB_REVIEWS; j++) {
      const review = reviews[j % reviews.length];
      review.trainingId = i + 1;
      review.memberId = getRandomInt(1, NB_MEMBERS);
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

export { importReviewsFromJSON };
    
    