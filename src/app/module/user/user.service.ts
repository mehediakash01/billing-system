import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/index';
import { AppError } from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';

const registerUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  const userJson = result.toObject();
  const { password, ...userWithoutPassword } = userJson;
  return userWithoutPassword;
};

const loginUser = async (payload: any) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new AppError(404, 'User account not found matching that email.');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(401, 'Invalid authentication password credentials.');
  }

  const jwtPayload = { userId: user._id, email: user.email, role: user.role };
  const accessToken = jwt.sign(jwtPayload, config.jwt.secret as string, {
    expiresIn: config.jwt.expires_in as any,
  });

  return { accessToken };
};

export const UserServices = { registerUserIntoDB, loginUser };