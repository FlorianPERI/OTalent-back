const debug = require('debug')('app:schema');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const member = readFileSync(path.join(__dirname, './member.gql'));
const organization = readFileSync(path.join(__dirname, './organization.gql'));
const review = readFileSync(path.join(__dirname, './review.gql'));
const training = readFileSync(path.join(__dirname, './training.gql'));
const category = readFileSync(path.join(__dirname, './category.gql'));
const query = readFileSync(path.join(__dirname, './query.gql'));
const mutation = readFileSync(path.join(__dirname, './mutation.gql'));

const schema = `#graphql
  ${member}
  ${organization}
  ${review}
  ${training}
  ${category}
  ${query}
  ${mutation}
`;

debug('schema created');

module.exports = schema;
