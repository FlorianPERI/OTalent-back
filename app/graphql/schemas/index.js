import Debug from 'debug';
import { readFileSync } from 'node:fs';
import * as url from 'url';
import path from 'node:path';

const debug = Debug('app:schemas');
const dirname = url.fileURLToPath(new URL('.', import.meta.url));

/**
 * Read the contents of the specified file synchronously.
 * @param {string} filePath - The path to the file.
 * @returns {string} - The contents of the file.
 */
const readFile = (filePath) => readFileSync(path.join(dirname, filePath));

const member = readFile('./member.gql');
const organization = readFile('./organization.gql');
const review = readFile('./review.gql');
const training = readFile('./training.gql');
const category = readFile('./category.gql');
const sirene = readFile('./sirene.gql');
const query = readFile('./query.gql');
const mutation = readFile('./mutation.gql');

/**
 * Combine all the GraphQL schemas into a single string.
 * @returns {string} - The combined schemas.
 */
const schemas = `#graphql
    ${member}
    ${organization}
    ${review}
    ${training}
    ${category}
    ${sirene}
    ${query}
    ${mutation}
  `;

debug('schemas combined successfully');

export default schemas;
