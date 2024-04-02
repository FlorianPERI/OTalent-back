import jwt from 'jsonwebtoken';
import 'dotenv/config';

function generateToken(entity, userId) {
  const token = jwt.sign(
    { member: entity === 'member', id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_DURATION },
  );
  return token;
}

export default { generateToken };
