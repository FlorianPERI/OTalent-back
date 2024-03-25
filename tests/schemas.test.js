import axios from 'axios';

/**
 * Executes a GraphQL query using axios and checks the response data.
 * @param {string} query - The GraphQL query string.
 * @param {Function} checkResponse - A function to check the response data.
 * @returns {Promise<void>}
 */
async function testQuery(query, checkResponse) {
  const result = await axios.post('http://localhost:3000/graphql', { query });
  checkResponse(result.data.data);
}

/**
 * Test case for the Category query.
 */
test('Category query', async () => {
  const query = `
    query {
      category(id: 1) {
        id
        label
        members {
          id
          firstname
        }
        trainings {
          id
          label
        }
      }
    }
  `;
  await testQuery(query, (data) => {
    // Check that the query returned a category
    expect(data.category).toBeDefined();
    expect(typeof data.category.id).toBe('string');
    expect(typeof data.category.label).toBe('string');

    // Check that the category has members
    expect(data.category.members).toBeDefined();
    expect(Array.isArray(data.category.members)).toBe(true);
    if (data.category.members.length > 0) {
      expect(typeof data.category.members[0].id).toBe('string');
      expect(typeof data.category.members[0].firstname).toBe('string');
    }
    // Check that the category has trainings
    expect(data.category.trainings).toBeDefined();
    expect(Array.isArray(data.category.trainings)).toBe(true);
    if (data.category.trainings.length > 0) {
      expect(typeof data.category.trainings[0].id).toBe('string');
      expect(typeof data.category.trainings[0].label).toBe('string');
    }
  });
});

/**
 * Test case for the Training query.
 */
test('Training query', async () => {
  const query = `
    query {
      training(id: 15) {
        id
        label
        description
        price
        duration
        dates
        excerpt
        prerequisites
        program
        image
        organization {
          id
          name
        }
        category {
          id
          label
        }
        members {
          id
          firstname
        }
        reviews {
          id
          comment
        }
        averageRating
      }
    }
  `;
  await testQuery(query, (data) => {
    // Check that the query returned a training
    expect(data.training).toBeDefined();
    expect(typeof data.training.id).toBe('string');
    expect(typeof data.training.label).toBe('string');
    expect(typeof data.training.description).toBe('string');
    expect(typeof data.training.price).toBe('number');
    expect(typeof data.training.duration).toBe('number');
    expect(Array.isArray(data.training.dates)).toBe(true);
    expect(typeof data.training.excerpt).toBe('string');
    expect(typeof data.training.prerequisites).toBe('string');
    expect(typeof data.training.program).toBe('string');
    expect(typeof data.training.image).toBe('string');

    // Check that the training has an organization
    expect(data.training.organization).toBeDefined();
    expect(typeof data.training.organization.id).toBe('string');
    expect(typeof data.training.organization.name).toBe('string');

    // Check that the training has a category
    expect(data.training.category).toBeDefined();
    expect(typeof data.training.category.id).toBe('string');
    expect(typeof data.training.category.label).toBe('string');

    // Check that the training has members
    expect(data.training.members).toBeDefined();
    expect(Array.isArray(data.training.members)).toBe(true);
    if (data.training.members.length > 0) {
      expect(typeof data.training.members[0].id).toBe('string');
      expect(typeof data.training.members[0].firstname).toBe('string');
    }

    // Check that the training has reviews
    expect(data.training.reviews).toBeDefined();
    expect(Array.isArray(data.training.reviews)).toBe(true);
    if (data.training.reviews.length > 0) {
      expect(typeof data.training.reviews[0].id).toBe('string');
      expect(typeof data.training.reviews[0].comment).toBe('string');
    }

    // Check that the training has an average rating
    if (data.training.averageRating !== null) {
      expect(typeof data.training.averageRating).toBe('number');
    }
  });
});

/**
 * Test case for the Organization query.
 */
test('Organization query', async () => {
  const query = `
    query {
      organization(id: 1) {
        id
        name
        email
        password
        phone_number
        address
        city
        postal_code
        siret
        image
        url_site
        trainings {
          id
          label
        }
      }
    }
  `;
  await testQuery(query, (data) => {
    // Check that the query returned an organization
    expect(data.organization).toBeDefined();
    expect(typeof data.organization.id).toBe('string');
    expect(typeof data.organization.name).toBe('string');
    expect(typeof data.organization.email).toBe('string');
    expect(typeof data.organization.password).toBe('string');
    expect(typeof data.organization.phone_number).toBe('string');
    expect(typeof data.organization.address).toBe('string');
    expect(typeof data.organization.city).toBe('string');
    expect(typeof data.organization.postal_code).toBe('string');
    expect(typeof data.organization.siret).toBe('string');
    if (data.organization.image) {
      expect(typeof data.organization.image).toBe('string');
    }
    if (data.organization.url_site) {
      expect(typeof data.organization.url_site).toBe('string');
    }

    // Check that the organization has trainings
    expect(data.organization.trainings).toBeDefined();
    expect(Array.isArray(data.organization.trainings)).toBe(true);
    if (data.organization.trainings.length > 0) {
      expect(typeof data.organization.trainings[0].id).toBe('string');
      expect(typeof data.organization.trainings[0].label).toBe('string');
    }
  });
});

/**
 * Test case for the Member query.
 */
test('Member query', async () => {
  const query = `
    query {
      member(id: 1) {
        id
        firstname
        lastname
        email
        password
        city
        postal_code
        avatar
        categories {
          id
          label
        }
        trainings {
          id
          label
        }
        reviews {
          id
          rating
          comment
        }
      }
    }
  `;
  await testQuery(query, (data) => {
    // Check that the query returned a member
    expect(data.member).toBeDefined();
    expect(typeof data.member.id).toBe('string');
    expect(typeof data.member.firstname).toBe('string');
    expect(typeof data.member.lastname).toBe('string');
    expect(typeof data.member.email).toBe('string');
    expect(typeof data.member.password).toBe('string');
    if (data.member.city) {
      expect(typeof data.member.city).toBe('string');
    }
    if (data.member.postal_code) {
      expect(typeof data.member.postal_code).toBe('string');
    }
    if (data.member.avatar) {
      expect(typeof data.member.avatar).toBe('string');
    }

    // Check that the member has categories
    expect(data.member.categories).toBeDefined();
    expect(Array.isArray(data.member.categories)).toBe(true);
    if (data.member.categories.length > 0) {
      expect(typeof data.member.categories[0].id).toBe('string');
      expect(typeof data.member.categories[0].label).toBe('string');
    }

    // Check that the member has trainings
    expect(data.member.trainings).toBeDefined();
    expect(Array.isArray(data.member.trainings)).toBe(true);
    if (data.member.trainings.length > 0) {
      expect(typeof data.member.trainings[0].id).toBe('string');
      expect(typeof data.member.trainings[0].label).toBe('string');
    }

    // Check that the member has reviews
    expect(data.member.reviews).toBeDefined();
    expect(Array.isArray(data.member.reviews)).toBe(true);
    if (data.member.reviews.length > 0) {
      expect(typeof data.member.reviews[0].id).toBe('string');
      expect(typeof data.member.reviews[0].rating).toBe('number');
      if (data.member.reviews[0].comment) {
        expect(typeof data.member.reviews[0].comment).toBe('string');
      }
    }
  });
});

test('Review query', async () => {
  const query = `
    query {
      review(id: 1) {
        id
        rating
        comment
        training {
          id
          label
        }
        member {
          id
          firstname
        }
      }
    }
  `;

  await testQuery(query, (data) => {
    // Check that the query returned a review
    expect(data.review).toBeDefined();
    expect(typeof data.review.id).toBe('string');
    expect(typeof data.review.rating).toBe('number');
    if (data.review.comment) {
      expect(typeof data.review.comment).toBe('string');
    }

    // Check that the review has a training
    expect(data.review.training).toBeDefined();
    expect(typeof data.review.training.id).toBe('string');
    expect(typeof data.review.training.label).toBe('string');

    // Check that the review has a member
    expect(data.review.member).toBeDefined();
    expect(typeof data.review.member.id).toBe('string');
    expect(typeof data.review.member.firstname).toBe('string');
  });
});
