import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';
import mailService from '../../../../services/mail/index.js';

const debug = Debug('app:otalentDB:member');

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
    this.joinDataLoader('Training', 'member_likes_training', 'member_id', 'training_id');
    this.joinDataLoader('Category', 'member_likes_category', 'member_id', 'category_id');
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
    const query = {
      text: 'SELECT \'member\' as type, id, email, password FROM member WHERE email = $1 UNION SELECT \'organization\' as type, id, email, password FROM organization WHERE email = $1',
      values: [email],
    };
    debug(query);
    const response = await this.client.query(query);
    const user = response.rows[0];

    const isCorrect = user && await bcrypt.compare(password, user.password);
    if (!user || !isCorrect) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ member: user.type === 'member', id: user.id }, process.env.JWT_SECRET);
    return { token };
  }

  async forgotPassword(data) {
    const { email } = data;
    const query = {
      text: 'SELECT * FROM member WHERE email = $1',
      values: [email],
    };
    const response = await this.client.query(query);
    const user = response.rows[0];
    if (!user) {
      throw new Error("Sorry, we couldn't find any user with this email address.");
    }
    const resetToken = jwt.sign({ member: true, id: user.id }, process.env.JWT_SECRET);
    const emailSent = await mailService.sendPasswordReset(email, resetToken);
    return emailSent;
  }
}

export default Member;
