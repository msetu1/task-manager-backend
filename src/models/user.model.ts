import { model, Schema } from 'mongoose';
import { IUserRegister } from '../interface/user.interface';

const userSchema = new Schema<IUserRegister>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUserRegister>('User', userSchema);
