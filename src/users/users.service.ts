import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(user: User) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  findByEmail(email: string) {
    const userFind = this.userModel.findOne({ email: email });
    return userFind;
  }
}
