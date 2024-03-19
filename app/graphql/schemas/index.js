import Debug from 'debug';
const debug = Debug('app:schemas');
import { readFileSync } from 'node:fs';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import path from 'node:path';

const member = readFileSync(path.join(__dirname, './member.gql'));
const organization = readFileSync(path.join(__dirname, './organization.gql'));
const review = readFileSync(path.join(__dirname, './review.gql'));
const training = readFileSync(path.join(__dirname, './training.gql'));
const category = readFileSync(path.join(__dirname, './category.gql'));
const query = readFileSync(path.join(__dirname, './query.gql'));
const mutation = readFileSync(path.join(__dirname, './mutation.gql'));

const schemas = `#graphql
  ${member}
  ${organization}
  ${review}
  ${training}
  ${category}
  ${query}
  ${mutation}
`;

debug('schema created');

export default schemas;        