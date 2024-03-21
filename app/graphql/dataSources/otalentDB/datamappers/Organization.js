// import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';

// const debug = Debug('app:datasource:otalentDB:organization');

class Organization extends CoreDatamapper {
  tableName = 'organization';
}

export default Organization;
