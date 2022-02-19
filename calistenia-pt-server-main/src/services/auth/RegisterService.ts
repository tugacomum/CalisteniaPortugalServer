import bcrypt from 'bcryptjs';
import { resolve } from 'path';

import prismaClient from '../../prisma';
import { AppError } from '../../errors/AppError';
import SendMailService from './SendMailService';

export interface IRegisterData {
  nickname: string;
  email: string;
  password: string;
}

export class RegisterService {
  async execute(data: IRegisterData) {
    let { nickname, email, password } = data;

    const nickExists = await prismaClient.user.findFirst({
      where: {
        nickname
      }
    });

    if (nickExists) {
      throw new AppError('Esse nickname já existe!', 409);
    }

    const emailExists = await prismaClient.user.findFirst({
      where: {
        email
      }
    });

    if (emailExists) {
      throw new AppError('Esse email já existe!', 409);
    }

    password = await bcrypt.hash(password, 10);

    const code = Math.floor(Math.random() * (999_999 - 100_000 + 1)) + 100_000;

    await prismaClient.user.create({
      data: {
        nickname,
        email,
        password,
        verifyEmailCode: code,
        verifyEmailCodeExpiry: new Date(Date.now() + 30 * 60 * 1000) // 30 mins
      }
    });

    const variables = {
      name: nickname,
      code
    };

    const path = resolve(__dirname, '..', '..', 'views', 'email', 'verify.hbs');

    await SendMailService.execute(email, 'Verifique o seu email no Calistenia Portugal', variables, path);
  }
}