import Debug from 'debug';
import { readFileSync } from 'node:fs';
import * as url from 'url';
import path from 'node:path';

const debug = Debug('app:schemas');
const dirname = url.fileURLToPath(new URL('.', import.meta.url));

const member = readFileSync(path.join(dirname, './member.gql'));
const organization = readFileSync(path.join(dirname, './organization.gql'));
const review = readFileSync(path.join(dirname, './review.gql'));
const training = readFileSync(path.join(dirname, './training.gql'));
const category = readFileSync(path.join(dirname, './category.gql'));
const query = readFileSync(path.join(dirname, './query.gql'));
const mutation = readFileSync(path.join(dirname, './mutation.gql'));

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
