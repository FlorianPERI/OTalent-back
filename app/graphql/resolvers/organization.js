import Debug from 'debug';
const debug = Debug('app:resolvers:organization');

const organization = {
    trainings({ id: organizationId }, _, { dataSources }) {
        return dataSources.otalentDB.training.findByOrganizationId(organizationId);
    }
}

export default organization;