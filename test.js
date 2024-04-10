import { getDepartementsCode } from './app/graphql/dataSources/otalentDB/datamappers/utils/datamapperUtils.js';

function findByRegion(region) {
  const departmentsCode = getDepartementsCode(region);
  const placeholders = departmentsCode.map((code, index) => `$${index + 1}`).join(',');
  const values = departmentsCode.map((code) => `${code}%`);
  const query = {
    text: `SELECT * FROM training WHERE organization_id IN (
        SELECT id FROM organization WHERE postal_code LIKE ANY(ARRAY[${placeholders}])
    );`,
    values,
  };
}

const test = findByRegion('Bretagne');
