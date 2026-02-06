import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoomDTO {
  @ApiProperty({
    example: 'Standard Double',
    description: 'Name or type of the room',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 2,
    description: 'Maximum capacity of the room',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiProperty({
    example: true,
    description: 'Availability status of the room',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    example: 'name hotel',
    description: 'ID of the hotel this room belongs to',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  hotel?: string;

  @ApiProperty({
    example: '120',
    description: 'Room price per night',
    required: false,
  })
  price?: number;
}
