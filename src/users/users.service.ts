import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserResponseDto } from './dto/userResponse.dto';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<UserResponseDto> {
    const newUser = new this.userModel(user);
    const userSaved = await newUser.save();
    return UserMapper.convertUserToResponse(userSaved);
  }

  async findByEmail(email: string) {
    const userFind = await this.userModel.findOne({ email: email });
    return userFind;
  }
}
