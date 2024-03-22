import Debug from 'debug';
import DataLoader from 'dataloader';
import CoreDatamapper from './CoreDatamapper.js';

const debug = Debug('app:datasource:otalentDB:category');

class Category extends CoreDatamapper {
  tableName = 'category';

  constructor(options) {
    super(options);

    this.findByMemberIdsLoader = new DataLoader(async (ids) => {
      debug(`find all categories for members [${ids}]`);
      const query = {
        text: 'SELECT c.* FROM category c JOIN member_likes_category mlc ON mlc.category_id = c.id WHERE mlc.member_id = ANY($1);',
        values: [ids],
      };
      const results = await this.client.query(query);
      return ids.map((id) => results.rows.filter((row) => row.id === id));
    });
  }

  async findByMemberId(id) {
    const result = await this.findByMemberIdsLoader.load(id);
    return result || [];
  }
}

export default Category;
