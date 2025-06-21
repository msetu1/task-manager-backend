import { UserService } from '../services/user.service';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import httpStatusCodes from 'http-status-codes';
import { resetPasswordSchema, UserValidator } from '../utils/user.validator';

const loginUser = catchAsync(async (req, res) => {
  const result = await UserService.loginUser(req.body);
  const { accessToken } = result;

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: 'Logged in successfully !',
    data: {
      accessToken,
    },
  });
});

const registerUser = catchAsync(async (req, res) => {
  const validatedData = UserValidator.registerSchema.parse(req.body);

  const { confirmPassword, ...userData } = validatedData;
  const result = await UserService.registerUser(userData);

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: 'Registration successfully !',
    data: result,
  });
});

const allUser = catchAsync(async (req, res) => {
  const result = await UserService.allUser();
  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: 'User information retrieved successfully !',
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const validatedData = resetPasswordSchema.parse(req.body);

  const result = await UserService.resetPassword(validatedData);
  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: 'Password reset successfully !',
    data: result,
  });
});

export const UserController = {
  loginUser,
  registerUser,
  allUser,
  resetPassword,
};
