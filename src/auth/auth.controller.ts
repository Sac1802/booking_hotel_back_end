import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { userDTO } from 'src/users/dto/user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthUser } from './interfaces/auth-user.interface';
import { UserDocument } from 'src/users/schemas/user.schema';
import { LoginDto } from 'src/users/dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  register(@Body() body: userDTO) {
    return this.authService.register(body);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Logs in a user and returns a JWT' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Request() req: { user: UserDocument }, @Body() loginDto: LoginDto) {
    return this.authService.generateJwt(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({ summary: 'Retrieves the profile of the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@Request() req: { user: AuthUser }) {
    return req.user;
  }
}
