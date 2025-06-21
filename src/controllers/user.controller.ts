import { UserService } from '../services/user.service';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import httpStatusCodes from 'http-status-codes';
import { UserValidator } from '../utils/user.validator';

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

export const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await UserService.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: result.message,
    data: { resetUrl: result.resetUrl },
  });
});

export const resetPasswordWithToken = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  const result = await UserService.resetPasswordWithToken(
    token,
    newPassword,
    confirmPassword,
  );

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: result.message,
  });
});

export const UserController = {
  loginUser,
  registerUser,
  allUser,
  forgetPassword,
  resetPasswordWithToken,
};
