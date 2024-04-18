import Debug from 'debug';
import client from '../app/graphql/dataSources/otalentDB/services/client.js';
import importTrainingsFromJson from './utils/importTrainingsFromJson.js';
import importOrganizationsFromJson from './utils/importOrganizationsFromJson.js';
import importMembersFromJson from './utils/importMembersFromJson.js';
import importReviewsFromJson from './utils/importReviewsFromJson.js';
import importCategoriesFromJson from './utils/importCategoriesFromJson.js';
import {
  importMemberLikesCategory,
  importMemberLikesTraining,
} from './faker/seedFaker.js';

/**
 * Importing json files to get legth of them.
 */
import trainingsJson from './jsons/trainings.json' with { type: "json" };
import categoriesJson from './jsons/categories.json' with { type: "json" };
import membersJson from './jsons/members.json' with { type: 'json' };

const debug = Debug('app:seed');

/**
 * Numbers of data to import into the database.
 */
const MEMBERS = membersJson.length;
const TRAININGS = trainingsJson.length;
const CATEGORIES = categoriesJson.label.length;
const MEMBER_LIKES_CATEGORY = 250;
const MEMBER_LIKES_TRAINING = 400;


/**
 * Seeds the database with data from json files.
 */
async function seedDatabase() {
  try {
    await importMembersFromJson();
    await importOrganizationsFromJson();
    await importCategoriesFromJson();
    await importTrainingsFromJson();
    await importReviewsFromJson(MEMBERS, TRAININGS);
    await importMemberLikesCategory(
      MEMBER_LIKES_CATEGORY,
      MEMBERS,
      CATEGORIES,
    );
    await importMemberLikesTraining(
      MEMBER_LIKES_TRAINING,
      MEMBERS,
      TRAININGS,
    );
    debug('all data imported, closing connection...');
  } catch (error) {
    debug('An error occurred:', error);
  } finally {
    client.end();
  }
}

seedDatabase();
