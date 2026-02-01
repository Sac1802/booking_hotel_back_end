import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Execute the database seeding process' })
  @ApiResponse({
    status: 200,
    description: 'Database seeding completed successfully.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during seeding.',
  })
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
