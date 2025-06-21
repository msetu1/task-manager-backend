import httpStatusCodes from 'http-status-codes';
import {
  IResetPassword,
  IUserLogin,
  IUserRegister,
} from '../interface/user.interface';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import AppError from '../middlewares/errors/AppError';
import { createToken, loginUserEmail } from '../utils/tokenCreate';
import dbConfig from '../config/db.config';

// Login user
const loginUser = async (payload: IUserLogin) => {
  const user = await User.isUserExistsEmail(payload.email);
  if (!user) {
    throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found !');
  }

  const isPasswordCorrect = await User.isPasswordMatched(
    payload.password!,
    user.password!,
  );

  if (!isPasswordCorrect) {
    throw new AppError(httpStatusCodes.UNAUTHORIZED, 'Password is incorrect!');
  }

  const jwtPayload = {
    email: user.email,
    role: 'user',
  };
  // Create Access Token
  const accessToken = createToken(
    jwtPayload,
    dbConfig.jwt_access_secret as string,
    dbConfig.jwt_access_expires as string,
  );
  // console.log(accessToken)
  // Decode
  const decoded = jwt.decode(accessToken) as { email: string } | null;
  if (decoded?.email) {
    loginUserEmail(decoded.email);
  }

  return {
    accessToken,
    email: payload.email,
  };
};

// register user
const registerUser = async (payload: IUserRegister) => {
  const result = await User.create(payload);
  return result;
};

// all user service
const allUser = async () => {
  const result = await User.find();
  return result;
};
// Reset Password
const resetPassword = async (payload: IResetPassword) => {
  const { email, newPassword, confirmPassword } = payload;

  if (newPassword !== confirmPassword) {
    throw new AppError(httpStatusCodes.BAD_REQUEST, 'Passwords do not match');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
  }

  user.password = newPassword;
  await user.save();

  return {
    message: 'Password reset successful!',
    email: user.email,
  };
};

// export
export const UserService = {
  loginUser,
  registerUser,
  allUser,
  resetPassword,
};
