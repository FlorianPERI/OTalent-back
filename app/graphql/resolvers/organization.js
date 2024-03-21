import Debug from 'debug';

const debug = Debug('app:resolvers:organization');

const organization = {
  trainings({ id }, _, { dataSources }) {
    debug(`find all trainings of organization [${id}]`);
    return dataSources.otalentDB.training.findByOrganizationId(id);
  },
};

export default organization;
