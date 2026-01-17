import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { Types } from 'mongoose';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { userDTO } from 'src/users/dto/user.dto';
import { LoginDto } from 'src/users/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userDTO: userDTO) {
    let user = new User();
    user = UserMapper.convertDTOToUser(userDTO);
    const userFind = await this.usersService.findByEmail(user.email);
    if (userFind) {
      throw new UnauthorizedException('Email already in use');
    }

    return this.usersService.create(user);
  }

  async validateUser(loginDTO: LoginDto) {
    const userFind = await this.usersService.findByEmail(loginDTO.email);
    if (!userFind) return null;
    const match = await bcrypt.compare(loginDTO.password, userFind.password);
    if (!match) return null;

    return userFind;
  }

  generateJwt(user: User & { _id: Types.ObjectId }) {
    const payload = { sub: user._id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
