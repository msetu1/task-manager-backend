import express from 'express';
import { UserController } from '../controllers/user.controller';
const router = express.Router();

router.post('/login', UserController.loginUser);
router.post('/register', UserController.registerUser);
router.post('/reset-password', UserController.resetPassword);

export const UserRoutes = router;
