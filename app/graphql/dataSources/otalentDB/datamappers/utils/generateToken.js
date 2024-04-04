import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * Generates a JSON Web Token (JWT) with the provided entity and user ID.
 * @param {string} entity - The entity type (member or organization).
 * @param {number} userId - Tue user ID.
 * @returns {string} The generated JSON Web Token.
 */
function generateToken(entity, userId) {
  const token = jwt.sign(
    { member: entity === 'member', id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_DURATION },
  );
  return token;
}

export default { generateToken };
