import { AppError } from '../../errors/AppError';
import prismaClient from '../../prisma';

interface IVerifyAccData {
  login: string;
  code: string;
}

export class VerifyAccService {
  async execute({ login, code }: IVerifyAccData) {
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

    if (user.emailVerified)
      throw new AppError('Email já verificado', 400);

    if (user.verifyEmailCode !== Number(code))
      throw new AppError('Código de verificação inválido', 401);

    if (Date.now() > user.verifyEmailCodeExpiry!.getTime())
      throw new AppError('Código de verificação expirado', 401);

    await prismaClient.user.update({
      where: {
        id: user.id
      },
      data: {
        emailVerified: true,
        verifyEmailCode: null,
        verifyEmailCodeExpiry: null
      }
    });
  }
}