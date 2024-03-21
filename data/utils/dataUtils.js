import dayjs from 'dayjs';
import { fakerFR as faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import 'dotenv/config';

/**
 * Formating a date with dayJs
 * @param {date} date to format
 * @returns {date}
 */
function formatingDate(date) {
  const formatedDate = dayjs(date).format('YYYY-MM-DD');
  return formatedDate;
}
/**
 * Generates a random integer between the specified minimum and maximum values.
 * @param {number} min - Minimum value (inclusive).
 * @param {number} max - Maximum value (exclusive).
 * @returns {number} - A random integer within the specified range.
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
/**
 * Generates an array with random number of strings with random number of words.
 * @param {number} minLength - Minimum length of the array.
 * @param {number} maxLength - Maximum length of the array.
 * @param {number} minWords - Minimum number of words per string.
 * @param {number} maxWords - Maximum number of words per string.
 * @returns {string<Array>} - A random array of strings.
 */
function generateRandomArray(minLength, maxLength, minWords, maxWords) {
  const array = [];
  const length = getRandomInt(minLength, maxLength);
  for (let i = 0; i < length; i += 1) {
    const str = faker.lorem.words({ min: minWords, max: maxWords });
    array.push(str);
  }
  return array;
}
/**
 * Verify if the provided postal code matches a regular expression pattern.
 * @param {string} postalCode - The costal code to be validated
 * @returns {boolean} - True if the postal code matches the regex, otherwise false.
 */
function matchPostalCodeRegex(postalCode) {
  const regex = /^0[1-9]\d{3}|[1-8]\d{4}|9[0-6]\d{3}|9[78][12478]\d{2}$/;
  if (regex.test(postalCode)) {
    return true;
  }
  return false;
}

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} - A Promise that resolves with the hashed password.
 */
async function hashingPassword(password) {
  const hash = await bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT));
  return hash;
}

export {
  formatingDate, getRandomInt, generateRandomArray, matchPostalCodeRegex, hashingPassword,
};
