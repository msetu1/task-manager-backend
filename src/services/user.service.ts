import httpStatusCodes from 'http-status-codes';
import crypto from 'crypto';
import { IUserLogin, IUserRegister } from '../interface/user.interface';
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

// forget password
const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
  }

  // Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenHashed = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordToken = resetTokenHashed;
  user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  return {
    message: 'Reset password link sent!',
    resetUrl,
  };
};

// Reset Password
const resetPasswordWithToken = async (
  token: string,
  newPassword: string,
  confirmPassword: string,
) => {
  if (newPassword !== confirmPassword) {
    throw new AppError(httpStatusCodes.BAD_REQUEST, 'Passwords do not match');
  }

  const resetTokenHashed = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: resetTokenHashed,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError(httpStatusCodes.BAD_REQUEST, 'Invalid or expired token');
  }

  // Update password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return {
    message: 'Password reset successful',
  };
};

// export
export const UserService = {
  loginUser,
  registerUser,
  allUser,
  resetPasswordWithToken,
  forgetPassword,
};
