import { Controller, Body, Query, Get } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Filters')
@Controller('search')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get()
  @ApiOperation({ summary: 'Search for available rooms based on various filters' })
  @ApiResponse({ status: 200, description: 'List of available room combinations.' })
  @ApiResponse({ status: 400, description: 'Invalid input parameters.' })
  @ApiQuery({ name: 'startDate', type: String, description: 'Start date of the reservation (YYYY-MM-DD)', example: '2024-03-01' })
  @ApiQuery({ name: 'endDate', type: String, description: 'End date of the reservation (YYYY-MM-DD)', example: '2024-03-05' })
  @ApiQuery({ name: 'peopleCount', type: String, description: 'Number of people', example: '2' })
  @ApiQuery({ name: 'city', type: String, required: false, description: 'City to search rooms in', example: 'New York' })
  @ApiQuery({ name: 'minPrice', type: String, required: false, description: 'Minimum price per night', example: '50.00' })
  @ApiQuery({ name: 'maxPrice', type: String, required: false, description: 'Maximum price per night', example: '200.00' })
  async searchRooms(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('peopleCount') peopleCount: string,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const count = parseInt(peopleCount, 10);
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;

    return this.filtersService.searchRooms(start, end, count, city, min, max);
  }
}
