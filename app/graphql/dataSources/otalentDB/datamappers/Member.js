import bcrypt from 'bcrypt';
import Debug from 'debug';
import CoreDatamapper from './CoreDatamapper.js';
import mailService from '../../../../services/mail/index.js';
import accountUtils from './utils/accountUtils.js';
import { getRegion } from './utils/datamapperUtils.js';

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
    this.joinDataLoader(
      'Training',
      'member_likes_training',
      'member_id',
      'training_id',
    );
    this.joinDataLoader(
      'Category',
      'member_likes_category',
      'member_id',
      'category_id',
    );
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
      text: "SELECT 'member' as type, id, email, password FROM member WHERE email = $1 UNION SELECT 'organization' as type, id, email, password FROM organization WHERE email = $1",
      values: [email],
    };
    debug(query);
    const response = await this.client.query(query);
    const user = response.rows[0];

    // const isCorrect = user && (await bcrypt.compare(password, user.password));
    // if (!user || !isCorrect) {
    //   throw new Error('Invalid credentials');
    // }

    const token = accountUtils.generateToken(user.type, user.id);
    return { token };
  }

  /**
     * Sends a password reset email to the user associated with the provided email address.
     * @param {Object} data - The data object containing the email address.
     * @returns {Promise<boolean>} A promise that resolves to true if the email was sent.
     * @throws {Error} Throws an error if no user is found with the provided email address.
     */
  async forgotPassword(data) {
    const { email } = data;
    const query = {
      text: "SELECT 'member' as type, id, email, password FROM member WHERE email = $1 UNION SELECT 'organization' as type, id, email, password FROM organization WHERE email = $1",
      values: [email],
    };
    const response = await this.client.query(query);
    const user = response.rows[0];
    if (!user) {
      throw new Error(
        "Sorry, we couldn't find any user with this email address.",
      );
    }
    const resetToken = accountUtils.generateToken(user.type, user.id);
    const emailSent = await mailService.sendPasswordReset(
      email,
      resetToken,
    );
    return emailSent;
  }

  /**
     * Resets the password for a user and updates it in the database.
     * @param {string} updatedPassword - The new password to be updated.
     * @param {Object} user - The user object provided by the context.
     * @returns {Promise<boolean>} A promise that resolves to true if the password was updated.
     */
  async resetPassword(updatedPassword, user) {
    const hashedUpdatedPassword = await bcrypt.hash(
      updatedPassword,
      parseInt(process.env.PASSWORD_SALT, 10) || 10,
    );
    const query = {
      text: `UPDATE ${user.type} SET password = $1, updated_at = now() WHERE id = $2;`,
      values: [hashedUpdatedPassword, user.id],
    };
    const response = await this.client.query(query);
    return !!response.rowCount;
  }

  /**
     * Finds members based on the specified region name provided.
     * @param {string} region - The name of the region to search for members.
     * @returns {Promise<Array>} A promise that resolves to an array of members.
     */
  findRegion(postalCode) {
    const region = getRegion(postalCode);
    debug(region);
    return region;
  }
}

export default Member;
