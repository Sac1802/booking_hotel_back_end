import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Patch,
  Get,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/decorators/user.decorator';
import { PreBookingDTO } from './dto/pre-booking.dto';
import { ConfirmBookingDto } from './dto/confirm-booking.dto';
import type { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Reservation')
@ApiBearerAuth()
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({
    status: 201,
    description: 'Reservation successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 409,
    description: 'Room already reserved for selected dates.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  createReservation(@Body() dto: CreateReservationDto, @User() user: AuthUser) {
    return this.reservationService.create(dto, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/bookings/summary')
  @ApiOperation({
    summary: 'Get a pre-booking summary with estimated costs and promotions',
  })
  @ApiResponse({
    status: 200,
    description: 'Pre-booking summary retrieved successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date range or hotel rooms.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  @ApiResponse({
    status: 409,
    description: 'Room already reserved for selected dates.',
  })
  summary(@Body() preBooking: PreBookingDTO) {
    return this.reservationService.preBooking(preBooking);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/bookings/confirm')
  @ApiOperation({
    summary: 'Confirm a pre-booking and create multiple reservations',
  })
  @ApiResponse({
    status: 201,
    description: 'Reservations successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 409,
    description: 'Room already reserved for selected dates.',
  })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  async confirm(@Body() dto: ConfirmBookingDto, @User() user: AuthUser) {
    const reservations = [];

    for (const roomsId of dto.roomId) {
      reservations.push(
        await this.reservationService.create(
          {
            roomId: roomsId,
            startDate: dto.startDate,
            endDate: dto.endDate,
            adultCount: dto.adultCount,
            childCount: dto.childCount,
          },
          user.id,
        ),
      );
    }

    return reservations;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/bookings/:id/cancel')
  @ApiOperation({ summary: 'Cancel an existing reservation' })
  @ApiResponse({
    status: 200,
    description: 'Reservation canceled successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Cancellation rejected (e.g., too close to check-in).',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (user not authorized to cancel this reservation).',
  })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  cancelled(@Param('id') id: string, @User() user: AuthUser) {
    return this.reservationService.validateCancellation(id, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/bookings')
  @ApiOperation({
    summary: 'Retrieve all reservations for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reservations for the user.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getAllREservationForUser(@User() user: AuthUser) {
    return this.reservationService.getReservationForUser(user.id);
  }
}
