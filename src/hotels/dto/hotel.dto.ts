import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class hotelDTO {
  @ApiProperty({ example: 'Grand Hyatt', description: 'Name of the hotel', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'New York', description: 'City where the hotel is located', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: '123 Main St', description: 'Address of the hotel', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'USA', description: 'Country where the hotel is located', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'A luxurious hotel in the heart of the city.', description: 'Description of the hotel', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, description: 'Whether the hotel is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
