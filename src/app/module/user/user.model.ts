import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config/index';

export const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
});

export const User = model('User', UserSchema);