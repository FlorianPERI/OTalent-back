// FILEPATH: /d:/OClock/Code/Apo/O-Talent-back/tests/data/createData.test.js
import {
  createMember, createOrganization, createReview, createTraining,
} from '../data/createData.js';
import { matchPostalCodeRegex } from '../data/utils/dataUtils.js';

describe('Data creation functions', () => {
  test('createMember should return a valid member object', async () => {
    const member = await createMember();
    expect(member).toHaveProperty('firstname');
    expect(member).toHaveProperty('lastname');
    expect(member).toHaveProperty('password');
    expect(member).toHaveProperty('email');
    expect(member).toHaveProperty('postalCode');
    expect(matchPostalCodeRegex(member.postalCode)).toBe(true);
    expect(member).toHaveProperty('city');
    expect(member).toHaveProperty('urlAvatar');
  });

  test('createOrganization should return a valid organization object', async () => {
    const organization = await createOrganization();
    expect(organization).toHaveProperty('name');
    expect(organization).toHaveProperty('email');
    expect(organization).toHaveProperty('password');
    expect(organization).toHaveProperty('phoneNumber');
    expect(organization).toHaveProperty('urlSite');
    expect(organization).toHaveProperty('address');
    expect(organization).toHaveProperty('city');
    expect(organization).toHaveProperty('postalCode');
    expect(matchPostalCodeRegex(organization.postalCode)).toBe(true);
    expect(organization).toHaveProperty('siret');
    expect(organization).toHaveProperty('image');
  });

  test('createReview should return a valid review object', () => {
    const review = createReview();
    expect(review).toHaveProperty('rating');
    expect(review.rating).toBeGreaterThanOrEqual(0);
    expect(review.rating).toBeLessThanOrEqual(5);
    expect(review).toHaveProperty('comment');
  });

  test('createTraining should return a valid training object', () => {
    const training = createTraining();
    expect(training).toHaveProperty('label');
    expect(training).toHaveProperty('description');
    expect(training).toHaveProperty('price');
    expect(training.price).toBeGreaterThanOrEqual(150);
    expect(training.price).toBeLessThanOrEqual(10000);
    expect(training).toHaveProperty('duration');
    expect(training.duration).toBeGreaterThanOrEqual(35);
    expect(training.duration).toBeLessThanOrEqual(2000);
    expect(training).toHaveProperty('startingDate');
    expect(training).toHaveProperty('endingDate');
    expect(training).toHaveProperty('excerpt');
    expect(training).toHaveProperty('prerequisites');
    expect(training).toHaveProperty('program');
    expect(training).toHaveProperty('image');
  });
});
