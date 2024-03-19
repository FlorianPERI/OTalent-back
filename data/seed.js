import {
  createMember, createOrganization, createTraining, createReview, getRandomInt
} from './createData.js';

const NB_MEMBERS = 200;
const NB_ORGANIZATIONS = 50;
const NB_REVIEWS = 450;
const NB_TRAININGS = 300;
const NB_CATEGORIES = 

function importMembers(NB_MEMBERS) {
  const inserts = [];
  for (let memberIndex = 0; memberIndex < NB_MEMBERS; memberIndex + 1) {
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
  for (let organizationIndex = 0; organizationIndex < NB_ORGANIZATIONS; organizationIndex + 1) {
    const organization = JSON.stringify(createOrganization());
    const query = {
      text: 'SELECT * FROM insert_organization($1);',
      values: [organization],
    };
    inserts.push(query);
  }
  return Promise.all(inserts);
}

function importReviews(NB_REVIEWS) {
  const inserts = [];
  for (let reviewIndex = 0; reviewIndex < NB_REVIEWS; reviewIndex + 1) {
    let review = JSON.stringify(createReview());
    review.trainingId = getRandomInt(1, NB_TRAININGS);
    review.memberId = getRandomInt(1, NB_MEMBERS);
    const query = {
      text: 'SELECT * FROM insert_review($1);',
      values: [review],
    };
    inserts.push(query);
  }
  return Promise.all(inserts);
}

function importTrainings(NB_TRAININGS) {
  const inserts = [];
  for (let trainingIndex = 0; trainingIndex < NB_TRAININGS; trainingIndex + 1) {
    let training = JSON.stringify(createTraining());
    training.organizationId = getRandomInt(1, NB_ORGANIZATIONS);
    training.categoryId = getRandomInt(1, NB_CATEGORIES);
    const query = {
      text: 'SELECT * FROM insert_training($1);',
      values: [training],
    };
    inserts.push(training);
  }
  return Promise.all(inserts);
}
