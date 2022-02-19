import prismaClient from '../prisma';

interface IEditProfileData {
  avatar?: string;
  nickname?: string;
  bio?: string;
  goals?: string;
}

export class EditProfileService {
  async execute(userId: number, { avatar, nickname, bio, goals }: IEditProfileData) {
    await prismaClient.user.update({
      where: {
        id: userId
      },
      data: {
        avatar,
        nickname,
        bio,
        goals
      }
    })
  }
}