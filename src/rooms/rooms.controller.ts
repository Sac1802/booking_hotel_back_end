import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomDTO } from './dto/room.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  createRoom(@Body() body: RoomDTO) {
    return this.roomsService.createRoom(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get/all')
  getAllRooms() {
    return this.roomsService.getAllRoom();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get/:id')
  getRoomById(@Param('id') id: string) {
    return this.roomsService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  updateRoom(@Body() body: RoomDTO, @Param('id') id: string) {
    return this.roomsService.updateRoom(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delereRoom(@Param('id') id: string) {
    return this.roomsService.deleteRoom(id);
  }
}
