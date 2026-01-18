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
import { HotelsService } from './hotels.service';
import { hotelDTO } from './dto/hotel.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  createHotel(@Body() body: hotelDTO) {
    return this.hotelsService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get/all')
  getAll() {
    return this.hotelsService.getAllHotel();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get/:id')
  getById(@Param('id') id: string) {
    return this.hotelsService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  updateHotel(@Body() body: hotelDTO, @Param('id') id: string) {
    return this.hotelsService.updateHotelById(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteHotel(@Param('id') id: string) {
    return this.hotelsService.deleteById(id);
  }
}
