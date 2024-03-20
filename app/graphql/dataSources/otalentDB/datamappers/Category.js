import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';

const debug = Debug('app:datasource:otalentDB:category');

class Category extends CoreDatamapper {
  tableName = 'category';

  constructor(options) {
    super(options);
    debug('category datamapper created');
  }

  async findByMemberId(id) {
    debug(`find all categories of member[${id}]`);
    const query = {
      text: 'SELECT c.* FROM category c JOIN member_likes_category mlc ON mlc.category_id = c.id WHERE mlc.member_id = $1;',
      values: [id],
    };
    const results = await this.client.query(query);
    return results.rows;
  }
}

export default Category;
