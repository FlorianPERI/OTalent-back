import Debug from 'debug';
import {
  createMember, createOrganization, createTraining, createReview,
} from './createFakerData.js';
import { getRandomInt } from '../utils/dataUtils.js';
import categoriesJson from '../jsons/categories.json' assert { type: 'json' };
import client from '../../app/graphql/dataSources/otalentDB/services/client.js';

const debug = Debug('app:faker');

/**
 * Numbers of data to import into the database.
 */
const MEMBERS = 110;
const ORGANIZATIONS = 50;
const REVIEWS = 450;
const TRAININGS = 100;
const CATEGORIES = categoriesJson.label.length;
const MEMBER_LIKES_TRAINING = 400;
const MEMBER_LIKES_CATEGORY = 250;

/**
 * Imports a specified number of members into the database.
 * @param {number} members - Number of members to import.
 * @returns {Promise<Array>} - A promise resolved with an array
 * containing the results of the insertion queries.
 */
async function importMembers(members) {
  debug('importing members');
  const inserts = [];
  const memberData = await createMember();
  for (let i = 0; i < members; i += 1) {
    const member = JSON.stringify(memberData);
    const query = {
      text: 'SELECT * FROM insert_member($1);',
      values: [member],
    };
    inserts.push(client.query(query));
  }
  return Promise.all(inserts);
}
/**
 * Imports a specified number of organizations into the database.
 * @param {number} organizations - Number of organizations to import.
 * @returns {Promise<Array>}
 */
async function importOrganizations(organizations) {
  debug('importing organizations');
  const inserts = [];
  const organizationData = await createOrganization(); // Move the await outside of the loop
  for (let i = 0; i < organizations; i += 1) {
    const organization = JSON.stringify(organizationData);
    const query = {
      text: 'SELECT * FROM insert_organization($1);',
      values: [organization],
    };
    inserts.push(client.query(query));
  }
  return Promise.all(inserts);
}
/**
 * Imports a specified number of reviews into the database.
 * @param {number} reviews - Number of reviews to import.
 * @returns {Promise<Array>}
 */
function importReviews(reviews, trainings, members) {
  debug('importing reviews');
  const inserts = [];
  for (let i = 0; i < reviews; i += 1) {
    let review = createReview();
    review.trainingId = getRandomInt(1, trainings);
    review.memberId = getRandomInt(1, members);
    review = JSON.stringify(review);
    const query = {
      text: 'SELECT * FROM insert_review($1);',
      values: [review],
    };
    inserts.push(client.query(query));
  }
  return Promise.all(inserts);
}
/**
 * Imports a specified number of trainings into the database.
 * @param {number} trainings - Number of trainings to import
 * @returns {Promise<Array>}
 */
function importTrainings(trainings, organizations, categories) {
  debug('importing trainings');
  const inserts = [];
  for (let i = 0; i < trainings; i += 1) {
    let training = createTraining();
    training.organizationId = getRandomInt(1, organizations);
    training.categoryId = getRandomInt(1, categories);
    training = JSON.stringify(training);
    const query = {
      text: 'SELECT * FROM insert_training($1);',
      values: [training],
    };
    inserts.push(client.query(query));
  }
  return Promise.all(inserts);
}
/**
 * Imports all categories from the json into the database
 * @params {number} categories - Categories to import.
 * @returns {Promise<Array>}
 */
function importCategoriesFromJson(categories) {
  debug('importing categories');
  const inserts = [];
  categories.label.forEach((category) => {
    const query = {
      text: 'INSERT INTO category (label) VALUES ($1);',
      values: [category],
    };
    inserts.push(client.query(query));
  });
  return Promise.all(inserts);
}
/**
 * Imports relationships between members and trainings into the database.
 * @param {number} member_likes_training - Number of relationships between
 * members and trainings to import.
 * @param {number} members - Number of members in the database.
 * @param {number} trainings - Number of trainings in the database.
 * @returns {Promise<Array>}
 */
function importMemberLikesTraining(memberLikesTraining, members, trainings) {
  debug('importing favorite trainings');
  const inserts = [];
  const uniquePairs = new Set();
  for (let i = 0; i < memberLikesTraining; i += 1) {
    let memberId; let trainingId; let
      pair;
    do {
      memberId = getRandomInt(1, members);
      trainingId = getRandomInt(1, trainings);
      pair = `${memberId}${trainingId}`;
    } while (uniquePairs.has(pair));
    uniquePairs.add(pair);
    const query = {
      text: 'INSERT INTO member_likes_training (member_id, training_id) VALUES ($1, $2);',
      values: [memberId, trainingId],
    };
    inserts.push(client.query(query));
  }
  return Promise.all(inserts);
}
/**
 * Imports relationships between members and categories into the database.
 * @param {number} member_likes_category - Number of relationships
 * between members and categories to import
 * @param {number} members - Number of members in the database.
 * @param {number} categories - Number of categories in the datase.
 * @returns {Promise<Array>}
 */
function importMemberLikesCategory(memberLikesCategory, members, categories) {
  debug('importing favorite categories');
  const inserts = [];
  const uniquePairs = new Set();
  for (let i = 0; i < memberLikesCategory; i += 1) {
    let memberId; let categoryId; let
      pair;
    do {
      memberId = getRandomInt(1, members);
      categoryId = getRandomInt(1, categories);
      pair = `${memberId},${categoryId}`;
    } while (uniquePairs.has(pair));
    uniquePairs.add(pair);
    const query = {
      text: 'INSERT INTO member_likes_category (member_id, category_id) VALUES ($1, $2);',
      values: [memberId, categoryId],
    };
    inserts.push(client.query(query));
  }
  return Promise.all(inserts);
}

/**
 * Seeds the database with faker data.
 */
async function seedFaker() {
  try {
    await importMembers(MEMBERS);
    await importOrganizations(ORGANIZATIONS);
    await importCategoriesFromJson(categoriesJson);
    await importTrainings(TRAININGS, ORGANIZATIONS, CATEGORIES);
    await importReviews(REVIEWS, TRAININGS, MEMBERS);
    await importMemberLikesCategory(MEMBER_LIKES_CATEGORY, MEMBERS, CATEGORIES);
    await importMemberLikesTraining(MEMBER_LIKES_TRAINING, MEMBERS, TRAININGS);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    debug('all data imported, closing connection...');
    client.end();
  };
}

if (import.meta.main) {
  seedFaker();
}

export { importMemberLikesCategory, importMemberLikesTraining };
