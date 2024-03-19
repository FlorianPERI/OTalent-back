import dayjs from 'dayjs';
import { faker } from '@faker-js/faker/locale/fr';
import { formatingDate, generateRandomArray, matchPostalCodeRegex} from './utils/dataUtils.js';

function createMember() {
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const password = faker.internet.password();
  const email = faker.internet.email({ firstName: firstname, lastName: lastname });
  let postalCode = faker.location.zipCode();
  while (!matchPostalCodeRegex(postalCode)) {
    postalCode = faker.location.zipCode();
  };
  const city = faker.location.city();
  const urlAvatar = faker.image.url();
  const member = {
    firstname,
    lastname,
    password,
    email,
    postalCode,
    city,
    urlAvatar,
  };
  return member;
};

function createOrganization() {
  const name = faker.company.name();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const phoneNumber = '0' + faker.string.numeric({ length: 9, allowLeadingZeros: false });
  const urlSite = faker.internet.url();
  const address = faker.location.street();
  const city = faker.location.city();
  let postalCode = faker.location.zipCode();
  while (!matchPostalCodeRegex(postalCode)) {
    postalCode = faker.location.zipCode();
  };
  const siret = faker.string.numeric(14);
  const image = faker.image.url();
  const organization = {
    name,
    email,
    password,
    phoneNumber,
    urlSite,
    address,
    city,
    postalCode,
    siret,
    image,
  };
  return organization;
};

function createReview() {
  const rating = faker.number.int({ min: 0, max: 5 });
  const comment = faker.lorem.words({ min: 5, max: 20 });
  let review = {
    rating,
    comment,
  };
  return review;
};

function createTraining() {
  const label = faker.lorem.words({ min: 3, max: 6 });
  const description = faker.lorem.words({ min: 120, max: 400 });
  const price = faker.number.int({ min: 150, max: 10000 });
  const duration = faker.number.int({ min: 35, max: 2000 });
  const startingDate = formatingDate(faker.date.anytime());
  const endingDate = formatingDate(faker.date.anytime())
  // const dates = [formatingDate(faker.date.anytime()), formatingDate(faker.date.anytime())];
  // console.log(dates);
  const excerpt = faker.lorem.words({ min: 10, max: 25 });
  const prerequisites = generateRandomArray(1, 4, 3, 8);
  const program = generateRandomArray(3, 9, 4, 10);
  const image = faker.image.url();
  const training = {
    label,
    description,
    price,
    duration,
    startingDate,
    endingDate,
    excerpt,
    prerequisites,
    program,
    image,
  };
  return training;
};

export {createMember, createOrganization, createReview, createTraining}

