import bcrypt from 'bcryptjs';
import { AppError } from '../../errors/AppError';
import prismaClient from '../../prisma';

interface IRecoverPassData {
  login: string;
  password: string;
  code: string;
}

export class RecoverPassService {
  async execute({ login, code, password }: IRecoverPassData) {
    const user = await prismaClient.user.findFirst({
      where: {
        OR: [
          { email: login },
          { nickname: login },
        ]
      }
    });

    if (!user)
      throw new AppError('Utilizador não encontrado', 404);

    if (!user.emailVerified)
      throw new AppError('Verificação de email em falta', 400);

    if (!user.passwordRecoveryCode)
      throw new AppError('O utilizador não requisitou a recuperação da password', 400);

    if (user.passwordRecoveryCode !== Number(code))
      throw new AppError('Código inválido', 401);

    if (Date.now() > user.passwordRecoveryExpiry!.getTime())
      throw new AppError('Código expirado', 401);

    password = await bcrypt.hash(password, 10);

    await prismaClient.user.update({
      where: {
        id: user.id
      },
      data: {
        password,
        passwordRecoveryCode: null,
        passwordRecoveryExpiry: null
      }
    });
  }
}