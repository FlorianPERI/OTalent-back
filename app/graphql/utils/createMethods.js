function createMethods(entityName, methodName) {
  const lowerCaseEntityName = entityName.toLowerCase();
  return {
    [lowerCaseEntityName]: ({ id }, _, { dataSources }) => dataSources.otalentDB[lowerCaseEntityName][methodName](id),
  };
}

function createQueryMethods(entityName, pluralEntityName = `${entityName}s`) {
  const lowerCaseEntityName = entityName.toLowerCase();
  const lowerCasePluralEntityName = pluralEntityName.toLowerCase();
  return {
    [lowerCaseEntityName]: (_, { id }, { dataSources }) => dataSources.otalentDB[lowerCaseEntityName].findByPk(id),
    [lowerCasePluralEntityName]: (_, __, { dataSources }) => dataSources.otalentDB[lowerCaseEntityName].findAll(),
  };
}

function createMutationMethods(entityName) {
  return {
    [`add${entityName}`]: (_, args, { dataSources }) => dataSources.otalentDB[entityName.toLowerCase()].insert(args),
    [`modify${entityName}`]: (_, { id, input }, { dataSources }) => dataSources.otalentDB[entityName.toLowerCase()].update(id, input),
    [`delete${entityName}`]: (_, { id }, { dataSources }) => dataSources.otalentDB[entityName.toLowerCase()].delete(id),
  };
}

function createAssociationMethods(entityName, associationName) {
  return {
    [`associate${entityName}${associationName}`]: (_, { memberId, id }, { dataSources }) => dataSources.otalentDB[entityName.toLowerCase()][`associate${entityName}${associationName}`](memberId, id),
    [`dissociate${entityName}${associationName}`]: (_, { memberId, id }, { dataSources }) => dataSources.otalentDB[entityName.toLowerCase()][`dissociate${entityName}${associationName}`](memberId, id),
  };
}

export {
  createMethods, createQueryMethods, createMutationMethods, createAssociationMethods,
};
