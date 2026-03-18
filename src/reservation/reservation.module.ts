import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Room, RoomSchema } from 'src/rooms/schemas/room.schema';
import {
  FestiveCalendar,
  FestiveCalendarSChema,
} from 'src/festive-calendar/schmes/festive.calendar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: Room.name, schema: RoomSchema },
      { name: FestiveCalendar.name, schema: FestiveCalendarSChema },
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
