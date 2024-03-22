/**
 * Creates a method object for a specific entity and method name.
 * @param {string} entityName - The name of the entity.
 * @param {string} methodName - The name of the method.
 * @param {string} [idField='id'] - The name of the ID field. Defaults to 'id'.
 * @returns {Object} - The method object.
 */
function createMethods(entityName, methodName, idField = 'id') {
  const lowerCaseEntityName = entityName.toLowerCase();
  let dataSourceName = lowerCaseEntityName;
  if (lowerCaseEntityName === 'categories') {
    dataSourceName = 'category';
  }
  if (lowerCaseEntityName.endsWith('s') && lowerCaseEntityName !== 'categories') {
    dataSourceName = lowerCaseEntityName.slice(0, -1);
  }
  const method = {
    [lowerCaseEntityName]: (obj, _, { dataSources }) => {
      const id = obj[idField];
      if (id === undefined) {
        throw new Error(`Missing ${idField} in ${lowerCaseEntityName}`);
      }
      if (Number.isNaN(id)) {
        throw new Error(`Invalid id: ${id}`);
      }
      return dataSources.otalentDB[dataSourceName][methodName](id);
    },
  };
  return method;
}

/**
 * Creates query methods for a specific entity.
 * @param {string} entityName - The name of the entity.
 * @param {string} [pluralEntityName=`${entityName}s`] - The plural name of the entity. Defaults to `${entityName}s`.
 * @returns {Object} - The query methods object.
 */
function createQueryMethods(entityName, pluralEntityName = `${entityName}s`) {
  const lowerCaseEntityName = entityName.toLowerCase();
  const lowerCasePluralEntityName = pluralEntityName.toLowerCase();
  return {
    [lowerCaseEntityName]: (_, { id }, { dataSources }) => dataSources.otalentDB[lowerCaseEntityName].findByPk(id),
    [lowerCasePluralEntityName]: (_, __, { dataSources }) => dataSources.otalentDB[lowerCaseEntityName].findAll(),
  };
}

/**
 * Creates mutation methods for a specific entity.
 * @param {string} entityName - The name of the entity.
 * @returns {Object} - The mutation methods object.
 */
function createMutationMethods(entityName) {
  const lowerCaseEntityName = entityName.toLowerCase();
  // Add your code here
}
  return {
    [`add${entityName}`]: (_, args, { dataSources }) => dataSources.otalentDB[lowerCaseEntityName].insert(args),
    [`modify${entityName}`]: (_, { id, input }, { dataSources }) => dataSources.otalentDB[lowerCaseEntityName].update(id, input),
    [`delete${entityName}`]: (_, { id }, { dataSources }) => dataSources.otalentDB[lowerCaseEntityName].delete(id),
  };
}

/**
 * Creates association methods for a specific entity and association.
 * @param {string} entityName - The name of the entity.
 * @param {string} associationName - The name of the association.
 * @returns {Object} - The association methods object.
 */
function createAssociationMethods(entityName, associationName) {
  const lowerCaseEntityName = entityName.toLowerCase();
  return {
    [`associate${entityName}${associationName}`]: (_, { memberId, id }, { dataSources }) => dataSources.otalentDB[lowerCaseEntityName][`associate${entityName}${associationName}`](memberId, id),
    [`dissociate${entityName}${associationName}`]: (_, { memberId, id }, { dataSources }) => dataSources.otalentDB[lowerCaseEntityName][`dissociate${entityName}${associationName}`](memberId, id),
  };
}

export {
  createMethods, createQueryMethods, createMutationMethods, createAssociationMethods,
};
