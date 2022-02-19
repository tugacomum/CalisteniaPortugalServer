import { resolve } from 'path';
import { AppError } from '../../errors/AppError';
import prismaClient from '../../prisma';
import SendMailService from './SendMailService';

export class ResendMailService {
  async execute(login: string) {
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
      throw new AppError('Utilizador já verificado', 400);

    const code = Math.floor(Math.random() * (999_999 - 100_000 + 1)) + 100_000;

    await prismaClient.user.update({
      where: {
        id: user.id
      },
      data: {
        verifyEmailCode: code,
        verifyEmailCodeExpiry: new Date(Date.now() + 30 * 60 * 1000) // 30 mins
      }
    })

    const variables = {
      name: user.nickname,
      code
    };

    const path = resolve(__dirname, '..', '..', 'views', 'email', 'verify.hbs');

    await SendMailService.execute(user.email, 'Verifique o seu email no Calistenia Portugal', variables, path);
  }
}