import express from 'express';
import { UserController } from '../controllers/user.controller';
import validateRequest from '../middlewares/validateRequest';
import { UserValidator } from '../utils/user.validator';
const router = express.Router();

router.post(
  '/login',
  validateRequest(UserValidator.loginSchema),
  UserController.loginUser,
);
router.post('/register', UserController.registerUser);
router.post('/reset-password', UserController.resetPassword);
router.get('/', UserController.allUser);

export const UserRoutes = router;
