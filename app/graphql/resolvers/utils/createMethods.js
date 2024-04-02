/**
 * Creates a method object for a specific entity and method name.
 *
 * @param {string} entityName - The name of the entity.
 * @param {string} methodName - The name of the method.
 * @param {string} [idField='id'] - The name of the ID field. Defaults to 'id'.
 * @returns {Object} - The method object.
 */
function createMethods(entityName, methodName, idField = 'id') {
  // Convert the entity name to lowercase
  const lowerCaseEntityName = entityName.toLowerCase();

  // Remove the 's' from the entity name if it is plural
  // and handle the special case for 'categories'
  let dataSourceName = lowerCaseEntityName;
  if (lowerCaseEntityName === 'categories') {
    dataSourceName = 'category';
  }
  if (lowerCaseEntityName.endsWith('s') && lowerCaseEntityName !== 'categories') {
    dataSourceName = lowerCaseEntityName.slice(0, -1);
  }

  // Create the method object
  const method = {
    [lowerCaseEntityName]: (obj, _, { dataSources }) => {
      const id = obj[idField];

      // Throw an error if the ID is missing
      if (id === undefined) {
        throw new Error(`Missing ${idField} in ${lowerCaseEntityName}`);
      }

      // Throw an error if the ID is invalid
      if (Number.isNaN(id)) {
        throw new Error(`Invalid id: ${id}`);
      }

      // Create the specified method dynamically
      // example : dataSources.otalentDB.training.findByCategory(id),
      return dataSources.otalentDB[dataSourceName][methodName](id);
    },
  };

  return method;
}

/**
   * Dynamically creates query methods for a specific entity.
   *
   * @param {string} entityName - The name of the entity.
   * @param {string} [pluralEntityName=`${entityName}s`] - The plural name of the entity.
   * @returns {Object} - The query methods object.
   */
function createQueryMethods(entityName, pluralEntityName = `${entityName}s`) {
  // Convert the entity names to lowercase
  const lowerCaseEntityName = entityName.toLowerCase();
  const lowerCasePluralEntityName = pluralEntityName.toLowerCase();

  // Create the query methods object
  // example : category: (_, { id }, { dataSources }) => dataSources
  // .otalentDB.category.findByPk(id),
  return {
    [lowerCaseEntityName]: (_, { id }, { dataSources }) => dataSources
      .otalentDB[lowerCaseEntityName].findByPk(id),
    [lowerCasePluralEntityName]: (_, __, { dataSources }) => dataSources
      .otalentDB[lowerCaseEntityName].findAll(),
  };
}

/**
   * Creates mutation methods for a specific entity.
   *
   * @param {string} entityName - The name of the entity.
   * @returns {Object} - The mutation methods object.
   */
function createMutationMethods(entityName) {
  // Convert the entity name to lowercase
  const lowerCaseEntityName = entityName.toLowerCase();

  // Create the mutation methods object
  // example : addCategory: (_, data, { dataSources }) =>
  // dataSources.otalentDB.category.insert(data),
  return {
    [`add${entityName}`]: (_, data, { user, dataSources }) =>
      // if (!user && !['Member', 'Organization'].includes(entityName)) {
      //   throw new Error('User not authenticated');
      // }
      dataSources.otalentDB[lowerCaseEntityName].insert(data),
    [`modify${entityName}`]: (_, data, { user, dataSources }) =>
      // if (!user && !['Member', 'Organization'].includes(entityName)) {
      //   throw new Error('User not authenticated');
      // }
      dataSources.otalentDB[lowerCaseEntityName].update(data.id, data),
    [`delete${entityName}`]: (_, { id }, { user, dataSources }) =>
      // if (!user) {
      //   throw new Error('User not authenticated');
      // }
      dataSources.otalentDB[lowerCaseEntityName].delete(id)
    ,
  };
}

/**
   * Creates association methods for a specific entity and association.
   *
   * @param {string} firstEntity - The name of the first entity.
   * @param {string} secondEntity - The name of the second entity.
   * @returns {Object} - The association methods object.
   */
function createAssociationMethods(firstEntity, secondEntity) {
  // Convert the entity names to lowercase
  const lowerFirstEntity = firstEntity.toLowerCase();
  const lowerSecondEntity = secondEntity.toLowerCase();

  // Create the association methods object
  // example : associateCategoryMember: (_, { categoryId, memberId }, { dataSources }) =>
  // dataSources.otalentDB.category.associateCategoryMember(categoryId, memberId),
  //
  return {
    [`associate${firstEntity}${secondEntity}`]: (_, { [`${lowerFirstEntity}Id`]: firstEntityId, [`${lowerSecondEntity}Id`]: secondEntityId }, { dataSources }) => dataSources.otalentDB[lowerFirstEntity][`associate${firstEntity}${secondEntity}`](firstEntityId, secondEntityId),
    [`dissociate${firstEntity}${secondEntity}`]: (_, { [`${lowerFirstEntity}Id`]: firstEntityId, [`${lowerSecondEntity}Id`]: secondEntityId }, { dataSources }) => dataSources.otalentDB[lowerFirstEntity][`dissociate${firstEntity}${secondEntity}`](firstEntityId, secondEntityId),
  };
}

export {
  createMethods, createQueryMethods, createMutationMethods, createAssociationMethods,
};
