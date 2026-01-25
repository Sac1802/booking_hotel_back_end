import { Controller, Body, Query, Get } from '@nestjs/common';
import { FiltersService } from './filters.service';

@Controller('search')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get()
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
