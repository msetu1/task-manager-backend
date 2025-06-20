// user login
export interface IUserLogin {
  email: string;
  password: string;
}

// user Register
export interface IUserRegister {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
}

export interface IResetPassword {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

// export interface IResetPasswordInput {
//   email: string;
// }

// export interface ISetNewPasswordInput {
//   newPassword: string;
//   confirmPassword: string;
// }
