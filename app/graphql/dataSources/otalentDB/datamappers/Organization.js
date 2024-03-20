import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';

const debug = Debug('app:datasource:otalentDB:organization');

class Organization extends CoreDatamapper {
  tableName = 'organization';

  constructor(options) {
    super(options);
    debug('organization datamapper created');
  }
}

export default Organization;
