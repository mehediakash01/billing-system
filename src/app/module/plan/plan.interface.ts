import { Document } from 'mongoose';

export interface TPlan extends Document {
  name: string;
  price: number;
  durationInDays: number;
  isActive: boolean;
}