import { AppError } from '../errors/AppError';
import prismaClient from '../prisma';

export class GetProfileService {
  async execute(userId: number) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user)
      throw new AppError('Utilizador não encontrado!', 404);

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      goals: user.goals,
      bio: user.bio,
      isAdmin: user.isAdmin
    };
  }
}