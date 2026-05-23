import express from 'express';

import { UserControllers } from './user.controller.js';
import { loginValidationSchema, registerValidationSchema } from './user.validation.js';
import { validateRequest } from '../../middlewares/ValidateRequest.js';

const router = express.Router();

router.post('/register', validateRequest(registerValidationSchema), UserControllers.registerUser);
router.post('/login', validateRequest(loginValidationSchema), UserControllers.loginUser);

export const UserRoutes = router;