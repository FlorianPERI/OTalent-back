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
 * @param {string} [pluralEntityName=`${entityName}s`] - The plural name of the entity.
 * @returns {Object} - The query methods object.
 */
function createQueryMethods(entityName, pluralEntityName = `${entityName}s`) {
  const lowerCaseEntityName = entityName.toLowerCase();
  const lowerCasePluralEntityName = pluralEntityName.toLowerCase();
  return {
    [lowerCaseEntityName]: (_, { id }, { dataSources }) => dataSources
      .otalentDB[lowerCaseEntityName].findByPk(id),
    [lowerCasePluralEntityName]: (_, __, { dataSources }) => dataSources
      .otalentDB[lowerCaseEntityName].findAll(),
  };
}

/**
 * Creates mutation methods for a specific entity.
 * @param {string} entityName - The name of the entity.
 * @returns {Object} - The mutation methods object.
 */
function createMutationMethods(entityName) {
  const lowerCaseEntityName = entityName.toLowerCase();
  return {
    [`add${entityName}`]: (_, data, { user, dataSources }) => {
      if (!user && entityName !== 'Member') {
        throw new Error('User not authenticated.');
      }
      return dataSources.otalentDB[lowerCaseEntityName].insert(data);
    },
    [`modify${entityName}`]: (_, data, { user, dataSources }) => {
      if (!user && entityName !== 'Member') {
        throw new Error('User not authenticated');
      }
      return dataSources.otalentDB[lowerCaseEntityName].update(data.id, data);
    },
    [`delete${entityName}`]: (_, { id }, { user, dataSources }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      return dataSources.otalentDB[lowerCaseEntityName].delete(id);
    },
  };
}

/**
 * Creates association methods for a specific entity and association.
 * @param {string} entityName - The name of the entity.
 * @param {string} associationName - The name of the association.
 * @returns {Object} - The association methods object.
 */
function createAssociationMethods(firstEntity, secondEntity) {
  const lowerFirstEntity = firstEntity.toLowerCase();
  const lowerSecondEntity = secondEntity.toLowerCase();
  return {
    [`associate${firstEntity}${secondEntity}`]: (_, { [`${lowerFirstEntity}Id`]: firstEntityId, [`${lowerSecondEntity}Id`]: secondEntityId }, { dataSources }) => dataSources.otalentDB[lowerFirstEntity][`associate${firstEntity}${secondEntity}`](firstEntityId, secondEntityId),
    [`dissociate${firstEntity}${secondEntity}`]: (_, { [`${lowerFirstEntity}Id`]: firstEntityId, [`${lowerSecondEntity}Id`]: secondEntityId }, { dataSources }) => dataSources.otalentDB[lowerFirstEntity][`dissociate${firstEntity}${secondEntity}`](firstEntityId, secondEntityId),
  };
}

export {
  createMethods, createQueryMethods, createMutationMethods, createAssociationMethods,
};
