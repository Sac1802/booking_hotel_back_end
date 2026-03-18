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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Hotels')
@ApiBearerAuth()
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @ApiOperation({ summary: 'Create a new hotel' })
  @ApiResponse({ status: 201, description: 'Hotel created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createHotel(@Body() body: hotelDTO) {
    return this.hotelsService.create(body);
  }

  @Get('get/all')
  @ApiOperation({ summary: 'Retrieve all hotels' })
  @ApiResponse({ status: 200, description: 'List of all hotels.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getAll() {
    return this.hotelsService.getAllHotel();
  }

  @Get('get/:id')
  @ApiOperation({ summary: 'Retrieve a hotel by ID' })
  @ApiResponse({ status: 200, description: 'Hotel found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Hotel not found.' })
  getById(@Param('id') id: string) {
    return this.hotelsService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  @ApiOperation({ summary: 'Update an existing hotel by ID' })
  @ApiResponse({ status: 200, description: 'Hotel updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Hotel not found.' })
  updateHotel(@Body() body: hotelDTO, @Param('id') id: string) {
    return this.hotelsService.updateHotelById(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a hotel by ID' })
  @ApiResponse({ status: 200, description: 'Hotel deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Hotel not found.' })
  deleteHotel(@Param('id') id: string) {
    return this.hotelsService.deleteById(id);
  }
}
