import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserRegister, IUserRegisterModel } from '../interface/user.interface';
import dbConfig from '../config/db.config';

const userSchema = new Schema<IUserRegister>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    imageUrl: { type: String },

    // For forget/reset password
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const saltRounds = Number(dbConfig.bcrypt_salt_rounds) || 10;
  this.password = await bcrypt.hash(this.password as string, saltRounds);
  next();
});

//  Check user by email & get password
userSchema.statics.isUserExistsEmail = async function (email: string) {
  return await this.findOne({ email }).select('+password');
};

//  Compare plain vs hashed password
userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Export the model
export const User = model<IUserRegister, IUserRegisterModel>(
  'User',
  userSchema,
);
