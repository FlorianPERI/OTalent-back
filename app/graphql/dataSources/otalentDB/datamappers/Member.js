import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';

const debug = Debug('app:datasource:otalentDB:member');

class Member extends CoreDatamapper {
  tableName = 'member';

  constructor(options) {
    super(options);
    debug('member datamapper created');
  }
}

export default Member;
