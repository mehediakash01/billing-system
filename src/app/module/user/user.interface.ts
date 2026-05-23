import { InferSchemaType } from 'mongoose';
import { UserSchema } from './user.model';

export type TUser = InferSchemaType<typeof UserSchema>;