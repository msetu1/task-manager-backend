import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserRegister, IUserRegisterModel } from '../interface/user.interface';
import dbConfig from '../config/db.config';

const userSchema = new Schema<IUserRegister>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  },
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = Number(dbConfig.bcrypt_salt_rounds) || 10;
  this.password = await bcrypt.hash(this.password as string, saltRounds);
  next();
});

// Static: Find user by email
userSchema.statics.isUserExistsEmail = async function (email: string) {
  return await this.findOne({ email }).select('+password');
};

//  Static: Compare passwords
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUserRegister, IUserRegisterModel>(
  'User',
  userSchema,
);
