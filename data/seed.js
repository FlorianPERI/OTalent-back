import {
  createMember, createOrganization, createTraining, createReview
} from './createData.js';
import {
  formatingDate, generateRandomArray, getRandomInt
} from './utils/dataUtils.js';
import categories from './categories.json' assert {type:"json"};

const NB_MEMBERS = 200;
const NB_ORGANIZATIONS = 50;
const NB_REVIEWS = 450;
const NB_TRAININGS = 300;
const NB_CATEGORIES = categories.label.length;
const NB_MEMBER_LIKES_TRAINING = 400;
const NB_MEMBER_LIKES_CATEGORY = 250;

function importMembers(NB_MEMBERS) {
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

function importOrganizations(NB_ORGANIZATIONS) {
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

function importReviews(NB_REVIEWS) {
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

function importTrainings(NB_TRAININGS) {
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

function importCategories(NB_CATEGORIES) {
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

function importMemberLikesTraining(NB_MEMBER_LIKES_TRAINING,NB_MEMBERS, NB_TRAININGS) {
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

function importMemberLikesCategory(NB_MEMBER_LIKES_CATEGORY, NB_MEMBERS, NB_CATEGORIES) {
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

import pkg from 'pg';
const { Client } = pkg;
const client = new Client('')

client.connect()
.then(() => importMembers(NB_MEMBERS))
.then(() => importOrganizations(NB_ORGANIZATIONS))
.then(() => importCategories(NB_CATEGORIES))
.then(() => importTrainings(NB_TRAININGS))
.then(() => importReviews(NB_REVIEWS))
.then(() => importMemberLikesCategory(NB_MEMBER_LIKES_CATEGORY, NB_MEMBERS, NB_CATEGORIES))
.then(() => importMemberLikesTraining(NB_MEMBER_LIKES_TRAINING, NB_MEMBERS, NB_TRAININGS))
.then(() => console.log('Données importées'))
.finally(() => client.end());
