import httpStatusCodes from 'http-status-codes';
import { IUserLogin, IUserRegister } from '../interface/user.interface';
import { User } from '../models/user.model';

// login user
const loginUser = async (payload: IUserLogin) => {
  console.log('');
};

// register user
const registerUser = async (payload: IUserRegister) => {
  console.log('');
};

// all user service
const allUser = async () => {
  const result = await User.find();
  return result;
};
// Reset Password
const resetPassword = async () => {
  console.log('');
};

// export
export const UserService = {
  loginUser,
  registerUser,
  allUser,
  resetPassword,
};
