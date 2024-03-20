import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';

const debug = Debug('app:datasource:otalentDB:category');

class Category extends CoreDatamapper {
  tableName = 'category';

  constructor(options) {
    super(options);
    debug('category datamapper created');
  }
}

export default Category;
