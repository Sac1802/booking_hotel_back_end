import { ApiProperty } from '@nestjs/swagger';

export class PreBookingDTO {
  @ApiProperty({
    example: '2024-03-01T10:00:00Z',
    description: 'The start date of the booking',
  })
  startDate: Date;

  @ApiProperty({
    example: '2024-03-05T12:00:00Z',
    description: 'The end date of the booking',
  })
  endDate: Date;

  @ApiProperty({
    type: [String],
    example: ['room1_id', 'room2_id'],
    description: 'An array of room IDs to pre-book',
  })
  roomsId: string[];

  @ApiProperty({ example: 2, description: 'Number of adults' })
  adultCount: number;

  @ApiProperty({ example: 1, description: 'Number of children' })
  childCount: number;
}
