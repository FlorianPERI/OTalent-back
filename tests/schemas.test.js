import axios from 'axios';

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

  const result = await axios.post('http://localhost:3000/graphql', { query });

  // Vérifie que la requête a renvoyé une catégorie
  expect(result.data.data.category).toBeDefined();
  expect(typeof result.data.data.category.id).toBe('string');
  expect(typeof result.data.data.category.label).toBe('string');

  // Vérifie que la catégorie a des membres
  expect(result.data.data.category.members).toBeDefined();
  expect(Array.isArray(result.data.data.category.members)).toBe(true);
  if (result.data.data.category.members.length > 0) {
    expect(typeof result.data.data.category.members[0].id).toBe('string');
    expect(typeof result.data.data.category.members[0].firstname).toBe('string');
  }

  // Vérifie que la catégorie a des formations
  expect(result.data.data.category.trainings).toBeDefined();
  expect(Array.isArray(result.data.data.category.trainings)).toBe(true);
  if (result.data.data.category.trainings.length > 0) {
    expect(typeof result.data.data.category.trainings[0].id).toBe('string');
    expect(typeof result.data.data.category.trainings[0].label).toBe('string');
  }
});

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

  const result = await axios.post('http://localhost:3000/graphql', { query });

  // Vérifie que la requête a renvoyé une formation
  expect(result.data.data.training).toBeDefined();
  expect(typeof result.data.data.training.id).toBe('string');
  expect(typeof result.data.data.training.label).toBe('string');
  expect(typeof result.data.data.training.description).toBe('string');
  expect(typeof result.data.data.training.price).toBe('number');
  expect(typeof result.data.data.training.duration).toBe('number');
  expect(Array.isArray(result.data.data.training.dates)).toBe(true);
  expect(typeof result.data.data.training.excerpt).toBe('string');
  expect(typeof result.data.data.training.prerequisites).toBe('string');
  expect(typeof result.data.data.training.program).toBe('string');
  expect(typeof result.data.data.training.image).toBe('string');

  // Vérifie que la formation a une organisation
  expect(result.data.data.training.organization).toBeDefined();
  expect(typeof result.data.data.training.organization.id).toBe('string');
  expect(typeof result.data.data.training.organization.name).toBe('string');

  // Vérifie que la formation a une catégorie
  expect(result.data.data.training.category).toBeDefined();
  expect(typeof result.data.data.training.category.id).toBe('string');
  expect(typeof result.data.data.training.category.label).toBe('string');

  // Vérifie que la formation a des membres
  expect(result.data.data.training.members).toBeDefined();
  expect(Array.isArray(result.data.data.training.members)).toBe(true);
  if (result.data.data.training.members.length > 0) {
    expect(typeof result.data.data.training.members[0].id).toBe('string');
    expect(typeof result.data.data.training.members[0].firstname).toBe('string');
  }

  // Vérifie que la formation a des avis
  expect(result.data.data.training.reviews).toBeDefined();
  expect(Array.isArray(result.data.data.training.reviews)).toBe(true);
  if (result.data.data.training.reviews.length > 0) {
    expect(typeof result.data.data.training.reviews[0].id).toBe('string');
    expect(typeof result.data.data.training.reviews[0].comment).toBe('string');
  }

  // Vérifie que la formation a une note moyenne
  expect(typeof result.data.data.training.averageRating).toBe('number');
});
