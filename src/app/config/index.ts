import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.MONGO_URI,
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUND) || 12,
  webhook: {
    secret: process.env.WEBHOOK_SECRET,
  },
  jwt: {
    secret: process.env.JWT_ACCESS_SECRET,
    expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  }
};