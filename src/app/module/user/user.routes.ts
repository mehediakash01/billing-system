import express from 'express';

import { UserControllers } from './user.controller';
import { loginValidationSchema, registerValidationSchema } from './user.validation';
import { validateRequest } from '../../middlewares/ValidateRequest';

const router = express.Router();

router.post('/register', validateRequest(registerValidationSchema), UserControllers.registerUser);
router.post('/login', validateRequest(loginValidationSchema), UserControllers.loginUser);

export const UserRoutes = router;