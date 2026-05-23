import { z } from 'zod';

export const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email structure address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['client', 'admin']).optional(),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Provide a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});