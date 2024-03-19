const debug = require('debug')('app:resolver:query');

// const restoDB = new RestoDB();

const query = {
  cities(_, __, { dataSources }) {
    debug('find all cities');
    return dataSources.restoDB.city.findAll();
  },
  city(_, { id }, { dataSources }) {
    debug(`find city[${id}]`);
    return dataSources.restoDB.city.findByPk(id);
  },
  cookingStyles(_, __, { dataSources }) {
    debug('find all cookinStyles');
    return dataSources.restoDB.cookingStyle.findAll();
  },
  cookingStyle(_, { id }, { dataSources }) {
    debug(`find cookinStyle[${id}]`);
    return dataSources.restoDB.cookingStyle.findByPk(id);
  },
  restaurants(_, __, { dataSources }) {
    debug('find all restaurants');
    return dataSources.restoDB.restaurant.findAll();
  },
  restaurant(_, { id }, { dataSources }) {
    debug(`find restaurant[${id}]`);
    return dataSources.restoDB.restaurant.findByPk(id);
  },
  managers(_, __, { dataSources }) {
    debug('find all managers');
    return dataSources.restoDB.manager.findAll();
  },
  manager(_, { id }, { dataSources }) {
    debug(`find manager[${id}]`);
    return dataSources.restoDB.manager.findByPk(id);
  },
};

module.exports = query;