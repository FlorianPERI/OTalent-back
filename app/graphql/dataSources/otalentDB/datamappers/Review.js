import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';

const debug = Debug('app:datasource:otalentDB:review');

class Review extends CoreDatamapper {
  tableName = 'review';

  constructor(options) {
    super(options);
    debug('review datamapper created');
  }
}

export default Review;
