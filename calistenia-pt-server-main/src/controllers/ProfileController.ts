import { Request, Response } from 'express';
import { EditProfileService } from '../services/EditProfileService';
import { GetProfileService } from '../services/GetProfileService';

export class ProfileController {
  async edit(req: Request, res: Response) {
    const editProfileService = new EditProfileService();

    await editProfileService.execute(req.userId, req.body);

    res.status(200).send();
  }

  async get(req: Request, res: Response) {
    const getProfileService = new GetProfileService();

    const user = await getProfileService.execute(req.userId);

    res.status(200).json(user);
  }
}