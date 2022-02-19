import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../errors/AppError';
import prismaClient from '../../prisma';

interface ILoginData {
  login: string;
  password: string;
}

export class LoginService {
  async execute(data: ILoginData) {
    const { login, password } = data;

    const user = await prismaClient.user.findFirst({
      where: {
        OR: [
          { email: login },
          { nickname: login },
        ]
      }
    });

    if (!user)
      throw new AppError('Credenciais incorretas', 401);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      throw new AppError('Credenciais incorretas', 401);

    if (!user.emailVerified)
      throw new AppError('Email não verificado', 403);

    const token = jwt.sign({}, process.env.JWT_SECRET, {
      jwtid: user.id.toString(),
      issuer: 'Calistenia Portugal'
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        goals: user.goals,
        bio: user.bio,
        isAdmin: user.isAdmin
      }
    };
  }
}