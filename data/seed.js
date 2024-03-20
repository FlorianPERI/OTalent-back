import {
  createMember, createOrganization, createTraining, createReview
} from './createData.js';
import { getRandomInt } from './utils/dataUtils.js';
import categories from './categories.json' assert {type:"json"};
import Debug from 'debug';
const debug = Debug('data:seed');
import pkg from 'pg';

const { Client } = pkg;
const client = new Client({
host: process.env.PGHOST,
database: process.env.PGDATABASE,
user: process.env.PGUSER,
password: process.env.PGPASSWORD,
ssl: process.env.SSLMODE})

const NB_MEMBERS = 200;
const NB_ORGANIZATIONS = 50;
const NB_REVIEWS = 450;
const NB_TRAININGS = 300;
const NB_CATEGORIES = categories.label.length;
const NB_MEMBER_LIKES_TRAINING = 400;
const NB_MEMBER_LIKES_CATEGORY = 250;


/**
 * Imports a specified number of members into the database.
 * @param {number} NB_MEMBERS - Number of members to import.
 * @returns {Promise<Array>} - A promise resolved with an array containing the results of the insertion queries.
 */
function importMembers(NB_MEMBERS) {
  debug('importing members');
  const inserts = [];
  for (let memberIndex = 0; memberIndex < NB_MEMBERS; memberIndex += 1) {
    const member = JSON.stringify(createMember());
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
 * @param {number} NB_ORGANIZATIONS - Number of organizations to import. 
 * @returns {Promise<Array>}
 */
function importOrganizations(NB_ORGANIZATIONS) {
  debug('importing organizations');
  const inserts = [];
  for (let organizationIndex = 0; organizationIndex < NB_ORGANIZATIONS; organizationIndex += 1) {
    const organization = JSON.stringify(createOrganization());
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
 * @param {number} NB_REVIEWS - Number of reviews to import.
 * @returns {Promise<Array>}
 */
function importReviews(NB_REVIEWS) {
  debug('importing reviews');
  const inserts = [];
  for (let reviewIndex = 0; reviewIndex < NB_REVIEWS; reviewIndex += 1) {
    let review = createReview();
    review.trainingId = getRandomInt(1, NB_TRAININGS);
    review.memberId = getRandomInt(1, NB_MEMBERS);
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
 * @param {number} NB_TRAININGS - Number of trainings to import
 * @returns {Promise<Array>}
 */
function importTrainings(NB_TRAININGS) {
  debug('importing trainings');
  const inserts = [];
  for (let trainingIndex = 0; trainingIndex < NB_TRAININGS; trainingIndex += 1) {
    let training = createTraining();
    training.organizationId = getRandomInt(1, NB_ORGANIZATIONS);
    training.categoryId = getRandomInt(1, NB_CATEGORIES);
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
 * Imports a specified number of categories into the database.
 * @param {number} NB_CATEGORIES - Number of categories to import
 * @returns {Promise<Array>}
 */
function importCategories(NB_CATEGORIES) {
  debug('importing categories');
  const inserts = [];
  categories.label.forEach((category) => {
    const query = {
      text: 'INSERT INTO category (label) VALUES ($1);',
      values: [category],
    };
    inserts.push(client.query(query));
  })
  return Promise.all(inserts);
}
/**
 * Imports relationships between members and trainings into the database.
 * @param {number} NB_MEMBER_LIKES_TRAINING - Number of relationships between members and trainings to import.
 * @param {number} NB_MEMBERS - Number of members in the database.
 * @param {number} NB_TRAININGS - Number of trainings in the database.
 * @returns {Promise<Array>}
 */
function importMemberLikesTraining(NB_MEMBER_LIKES_TRAINING,NB_MEMBERS, NB_TRAININGS) {
  debug('importing favorite trainings');
  const inserts = [];
  for (let memberLikesTrainingIndex = 0; memberLikesTrainingIndex < NB_MEMBER_LIKES_TRAINING; memberLikesTrainingIndex += 1) {
    const memberId = getRandomInt(1, NB_MEMBERS);
    const trainingId = getRandomInt(1, NB_TRAININGS);
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
 * @param {number} NB_MEMBER_LIKES_CATEGORY - Number of relationships between members and categories to import
 * @param {number} NB_MEMBERS - Number of members in the database.
 * @param {number} NB_CATEGORIES - Number of categories in the datase.
 * @returns {Promise<Array>}
 */
function importMemberLikesCategory(NB_MEMBER_LIKES_CATEGORY, NB_MEMBERS, NB_CATEGORIES) {
  debug('importing favorite categories');
  const inserts = [];
  for (let memberLikesCategoryIndex = 0; memberLikesCategoryIndex < NB_MEMBER_LIKES_CATEGORY; memberLikesCategoryIndex += 1) {
    const memberId = getRandomInt(1, NB_MEMBERS);
    const categoryId = getRandomInt(1, NB_CATEGORIES);
    const query = {
      text: 'INSERT INTO member_likes_category (member_id, category_id) VALUES ($1, $2);',
      values: [memberId, categoryId],
    };
    inserts.push(client.query(query));
  }
  return Promise.all(inserts);
}


client.connect()
  .then(() => importMembers(NB_MEMBERS))
  .then(() => importOrganizations(NB_ORGANIZATIONS))
  .then(() => importCategories(NB_CATEGORIES))
  .then(() => importTrainings(NB_TRAININGS))
  .then(() => importReviews(NB_REVIEWS))
  .then(() => importMemberLikesCategory(NB_MEMBER_LIKES_CATEGORY, NB_MEMBERS, NB_CATEGORIES))
  .then(() => importMemberLikesTraining(NB_MEMBER_LIKES_TRAINING, NB_MEMBERS, NB_TRAININGS))
  .then(() => debug('all data imported'))
  .finally(() => client.end());
