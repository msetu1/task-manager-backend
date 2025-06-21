import { Model } from 'mongoose';

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

// reset Password
export interface IResetPassword {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUserRegisterModel extends Model<IUserRegister> {
  isUserExistsEmail(email: string): Promise<IUserRegister | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
