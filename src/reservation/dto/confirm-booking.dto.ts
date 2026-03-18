import { ApiProperty } from '@nestjs/swagger';

export class ConfirmBookingDto {
  @ApiProperty({
    example: '2024-03-01T10:00:00Z',
    description: 'The start date of the booking confirmation',
  })
  startDate: Date;

  @ApiProperty({
    example: '2024-03-05T12:00:00Z',
    description: 'The end date of the booking confirmation',
  })
  endDate: Date;

  @ApiProperty({
    type: [String],
    example: ['room1_id', 'room2_id'],
    description: 'An array of room IDs to confirm booking for',
  })
  roomsId: string[];

  @ApiProperty({
    example: 2,
    description: 'Number of adults for the reservation',
    minimum: 1,
  })
  adultCount: number;

  @ApiProperty({
    example: 0,
    description: 'Number of children for the reservation',
    minimum: 0,
  })
  childCount: number;
}
