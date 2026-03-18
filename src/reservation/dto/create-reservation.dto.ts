import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    example: '60c72b9f9b1d8c001f8e4a2a',
    description: 'The ID of the room to reserve',
  })
  roomId: string;

  @ApiProperty({
    example: '2024-03-01T10:00:00Z',
    description: 'The start date of the reservation',
  })
  startDate: Date;

  @ApiProperty({
    example: '2024-03-05T12:00:00Z',
    description: 'The end date of the reservation',
  })
  endDate: Date;

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
