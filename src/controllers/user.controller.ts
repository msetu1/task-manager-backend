import catchAsync from '../utils/catchAsync';

const loginUser = catchAsync(() => {
  console.log('');
});
const registerUser = catchAsync(() => {
  console.log('');
});
const allUser = catchAsync(() => {
  console.log('');
});
const resetPassword = catchAsync(() => {
  console.log('');
});

// export
export const UserController = {
  loginUser,
  registerUser,
  allUser,
  resetPassword,
};
