import dayjs from 'dayjs';
import { faker } from '@faker-js/faker/locale/fr';

function formatingDate(date) {
  const formatedDate = dayjs(date).format('YYYY-MM-DD');
  return formatedDate;
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

function generateRandomArray(minLength, maxLength, minWords, maxWords) {
  const array = [];
  const length = getRandomInt(minLength, maxLength);
  for (let i = 0; i < length; i += 1) {
    const str = faker.lorem.words({ min: minWords, max: maxWords });
    array.push(str);
  }
  return array;
};

function matchPostalCodeRegex(postalCode) {
  const regex = new RegExp('^0[1-9]\\d{3}|[1-8]\\d{4}|9[0-6]\\d{3}|9[78][12478]\\d{2}$');
  if (regex.test(postalCode)) {
      return true;
  } else {
      return false;
  }
}

const date = faker.date.anytime();
console.log(formatingDate(date));


export { formatingDate, getRandomInt, generateRandomArray, matchPostalCodeRegex };