import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/decorators/user.decorator';
import { ReservationDocument } from './schemas/reservation.schema';
import type { preBookingDTO } from './dto/pre-booking.dto';
import type { ConfirmBookingDto } from './dto/confirm-booking.dto';
import type { AuthUser } from 'src/auth/interfaces/auth-user.interface';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createReservation(@Body() dto: CreateReservationDto, @User() user: AuthUser) {
    return this.reservationService.create(dto, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/bookings/summary')
  sumary(@Body() preBooking: preBookingDTO) {
    return this.reservationService.preBooking(preBooking);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/bookings/confirm')
  async confirm(@Body() dto: ConfirmBookingDto, @User() user: AuthUser) {
    const reservations: ReservationDocument[] = [];

    for (const roomId of dto.roomsId) {
      reservations.push(
        await this.reservationService.create(
          {
            roomId,
            startDate: dto.startDate,
            endDate: dto.endDate,
          },
          user.id,
        ),
      );
    }

    return reservations;
  }
}
