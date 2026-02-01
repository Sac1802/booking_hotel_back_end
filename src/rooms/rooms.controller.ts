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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createRoom(@Body() body: RoomDTO) {
    return this.roomsService.createRoom(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get/all')
  @ApiOperation({ summary: 'Retrieve all rooms' })
  @ApiResponse({ status: 200, description: 'List of all rooms.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getAllRooms() {
    return this.roomsService.getAllRoom();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get/:id')
  @ApiOperation({ summary: 'Retrieve a room by ID' })
  @ApiResponse({ status: 200, description: 'Room found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  getRoomById(@Param('id') id: string) {
    return this.roomsService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  @ApiOperation({ summary: 'Update an existing room by ID' })
  @ApiResponse({ status: 200, description: 'Room updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  updateRoom(@Body() body: RoomDTO, @Param('id') id: string) {
    return this.roomsService.updateRoom(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room by ID' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  delereRoom(@Param('id') id: string) {
    return this.roomsService.deleteRoom(id);
  }
}
