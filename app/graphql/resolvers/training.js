import Debug from 'debug';
const debug = Debug('app:resolvers:training');

const training = {
    category({ category_id: categoryId }, _, { dataSources }) {
        return dataSources.otalentDB.category.findByPk(categoryId);
    },

    organization({ organization_id: organizationId }, _, { dataSources }) {
        return dataSources.otalentDB.organization.findByPk(organizationId);
    },

    members({ id }, _, { dataSources }) {
        return dataSources.otalentDB.member.findByTrainingId(id);
    },

    reviews({ id }, _, { dataSources }) {
        return dataSources.otalentDB.review.findByTrainingId(id);
    },
}

export default training;