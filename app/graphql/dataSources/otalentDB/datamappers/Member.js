import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CoreDatamapper from './CoreDatamapper.js';
import 'dotenv/config';
import { isMember, isOrganization } from './utils/datamapperUtils.js';

/**
 * Represents a Member datamapper.
 * @extends CoreDatamapper
 */
class Member extends CoreDatamapper {
  tableName = 'member';

  constructor(options) {
    super(options);
    this.createAssociationMethods('Member', 'Category');
    this.createAssociationMethods('Member', 'Training');
    this.createDataLoaderWithJoin('Training', 'member_likes_training', 'member_id', 'training_id');
    this.createDataLoaderWithJoin('Category', 'member_likes_category', 'member_id', 'category_id');
  }

  /**
   * Finds members by training ID.
   * @param {number} id - The training ID.
   * @returns {Promise<Array>} - A promise that resolves to an array of members.
   */
  async findByTrainingId(id) {
    const result = await this.findByTrainingIdLoader.load(id);
    return result || [];
  }

  /**
   * Finds members by category ID.
   * @param {number} id - The category ID.
   * @returns {Promise<Array>} - A promise that resolves to an array of members.
   */
  async findByCategoryId(id) {
    const result = await this.findByCategoryIdLoader.load(id);
    return result || [];
  }

  /**
   * Authenticates a user based of the provided email and password.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<{ token: string }}
   * A promise that resolves to an object containing the authentication token.
   * @throws {Error} - Throws an error if the credantials are invalid.
   */
  async login(email, password) {
    let query;
    let user;
    let token;
    if (await isMember(email)) {
      query = {
        text: 'SELECT * FROM member WHERE email = $1',
        values: [email],
      };
      const response = await this.client.query(query);
      // eslint-disable-next-line prefer-destructuring
      user = response.rows[0];
    } else if (await isOrganization(email)) {
      query = {
        text: 'SELECT * FROM organization WHERE email = $1;',
        values: [email],
      };
      const response = await this.client.query(query);
      // eslint-disable-next-line prefer-destructuring
      user = response.rows[0];
    } else {
      throw new Error('Invalid credentials');
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      throw new Error('Invalid credentials');
    }
    if (await isMember(email)) {
      token = jwt.sign({ member: true, id: user.id }, process.env.JWT_SECRET);
    } else if (await isOrganization(email)) {
      token = jwt.sign({ member: false, id: user.id }, process.env.JWT_SECRET);
    }
    return { token };
  }
}

export default Member;
