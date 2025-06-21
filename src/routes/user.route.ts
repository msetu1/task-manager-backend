import express from 'express';
import { UserController } from '../controllers/user.controller';
import validateRequest from '../middlewares/validateRequest';
import { UserValidator } from '../utils/user.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = express.Router();

router.post(
  '/login',
  validateRequest(UserValidator.loginSchema),
  UserController.loginUser,
);
router.post('/register', UserController.registerUser);
router.post('/forget-password', UserController.forgetPassword);
router.post('/reset-password/:token', UserController.resetPasswordWithToken);
router.get('/', authMiddleware, UserController.allUser);

export const UserRoutes = router;
