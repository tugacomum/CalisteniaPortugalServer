import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { ProfileController } from './controllers/ProfileController';
import { ensureAuth } from './middlewares/ensureAuth';

const router = Router();

const authController = new AuthController();
const profileController = new ProfileController();

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify', authController.verify);
router.post('/resend', authController.resendVerification);
router.post('/recover/send', authController.sendRecoverEmail);
router.post('/recover', authController.recoverPassword);

router.get('/profile', ensureAuth, profileController.get);
router.patch('/profile', ensureAuth, profileController.edit);

export { router };