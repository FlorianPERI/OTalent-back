import dayjs from 'dayjs';
import { faker } from '@faker-js/faker/locale/fr';

const categories = ['Informatique', 'Mathématiques', 'Technologie', 'Chimie', 'Physique', 'Littérature', 'Langues', 'Arts', 'Histoire', 'Géographie', 'Sports', 'Développement personnel', 'Philosophie', 'Biologie', 'Zoologie', 'Finance', 'Sciences Politiques', 'Economie', 'Culture générale', 'Botanique', 'Astronomie'];

function formatingDate(date) {
  const formatedDate = dayjs(date).format('DD/MM/YYYY');
  return formatedDate;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomArray(minLength, maxLength, minWords, maxWords) {
  const array = [];
  const length = getRandomInt(minLength, maxLength);
  for (let i = 0; i < length; i + 1) {
    const str = faker.lorem.words({ min: minWords, max: maxWords });
    array.push(str);
  }
  return array;
}

function createMember() {
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const password = faker.internet.password();
  const email = faker.internet.email({ firstName: firstname, lastName: lastname });
  const postalCode = faker.location.zipCode();
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
}

function createOrganization() {
  const name = faker.company.name();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const phoneNumber = faker.phone.number();
  const urlSite = faker.internet.url();
  const address = faker.location.street();
  const city = faker.location.city();
  const postalCode = faker.location.zipCode();
  const siret = faker.number.bigInt();
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
}

function createReview() {
  const rating = faker.number.int({ min: 0, max: 5 });
  const comment = faker.lorem.words({ min: 5, max: 20 });
//   const trainingId = getRandomInt(1, 100);
//   const memberId = getRandomInt(1, 200);
  let review = {
    rating,
    comment,
  };
  review.trainingId = getRandomInt(1,100);
  review.memberId = getRandomInt(1, 200);
  return review;
}

function createTraining() {
  const label = faker.lorem.words({ min: 3, max: 6 });
  const description = faker.lorem.words({ min: 120, max: 400 });
  const price = faker.number.int({ min: 150, max: 10000 });
  const duration = faker.number.int({ min: 35, max: 2000 });
  const dates = [formatingDate(faker.date.anytime()), formatingDate(faker.date.anytime())];
  const excerpt = faker.lorem.words({ min: 10, max: 25 });
  const prerequisites = generateRandomArray(1, 4, 3, 8);
  const program = generateRandomArray(3, 9, 4, 10);
  const image = faker.image.url();
//   const organizationId = ;
//   const categoryId = ;
  const training = {
    label,
    description,
    price,
    duration,
    dates,
    excerpt,
    prerequisites,
    program,
    image,
    // organizationId,
    // categoryId
  };
  return training;
}

console.log(createReview());

module.exports = {
  createMember,
  createOrganization,
  createReview,
  createTraining,
};
