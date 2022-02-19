import { Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { LoginService } from '../services/auth/LoginService';
import { RecoverPassService } from '../services/auth/RecoverPassService';
import { RegisterService } from '../services/auth/RegisterService';
import { ResendMailService } from '../services/auth/ResendMailService';
import { SendRecoveryEmailService } from '../services/auth/SendRecoveryEmailService';
import { VerifyAccService } from '../services/auth/VerifyAccService';

export class AuthController {
  async register(req: Request, res: Response) {
    const { nickname, email, password } = req.body;

    if (!nickname)
      throw new AppError('Campo nickname em falta', 400);

    if (!email)
      throw new AppError('Campo email em falta', 400);

    if (!password)
      throw new AppError('Campo password em falta', 400);

    const registerService = new RegisterService();

    await registerService.execute({
      nickname,
      email,
      password
    });

    return res.status(201).send();
  }

  async login(req: Request, res: Response) {
    const { login, password } = req.body;

    if (!login)
      throw new AppError('Email ou nickname em falta', 400);

    if (!password)
      throw new AppError('Password em falta', 400);

    const loginService = new LoginService();

    const { token, user } = await loginService.execute({
      login,
      password
    });

    return res.status(200).send({ token, user });
  }

  async verify(req: Request, res: Response) {
    const { login, code } = req.body;

    if (!login)
      throw new AppError('Email ou nickname em falta', 400);

    if (!code)
      throw new AppError('Código de verificação em falta', 400);

    const verifyAccService = new VerifyAccService();

    await verifyAccService.execute({ login, code });

    res.status(200).send();
  }

  async resendVerification(req: Request, res: Response) {
    const { login } = req.body;

    if (!login)
      throw new AppError('Email ou nickname em falta', 400);

    const resendMailService = new ResendMailService();

    await resendMailService.execute(login);

    res.status(200).send();
  }

  async sendRecoverEmail(req: Request, res: Response) {
    const { login } = req.body;

    if (!login)
      throw new AppError('Email ou nickname em falta', 400);

    const sendRecoverEmailService = new SendRecoveryEmailService();

    await sendRecoverEmailService.execute(login);

    res.status(200).send();
  }

  async recoverPassword(req: Request, res: Response) {
    const { login, code, password } = req.body;

    if (!login)
      throw new AppError('Email ou nickname em falta', 400);

    if (!code)
      throw new AppError('Código de verificação em falta', 400);

    if (!password)
      throw new AppError('Nova password em falta', 400);

    const recoverPassService = new RecoverPassService();

    await recoverPassService.execute({ login, code, password });

    res.status(200).send();
  }
}