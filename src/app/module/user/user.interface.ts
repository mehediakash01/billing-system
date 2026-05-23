import { InferSchemaType } from 'mongoose';
import { UserSchema } from './user.model.js';

export type TUser = InferSchemaType<typeof UserSchema>;