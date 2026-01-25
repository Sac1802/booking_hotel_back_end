import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { Model } from 'mongoose';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { preBookingDTO } from './dto/pre-booking.dto';
import { Room, RoomDocument } from 'src/rooms/schemas/room.schema';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectModel(Room.name)
    private roomModel: Model<RoomDocument>,
  ) {}

  async checkAvailability(createReservationDto: CreateReservationDto) {
    const findRoom = await this.reservationModel.findOne({
      room: createReservationDto.roomId,
      active: true,
      startDate: { $lt: createReservationDto.endDate },
      endDate: { $gt: createReservationDto.startDate },
    });
    if (findRoom) return false;
    return true;
  }

  async create(createReservationDto: CreateReservationDto, userId: string) {
    const findRoom = await this.checkAvailability(createReservationDto);

    if (findRoom) {
      throw new ConflictException(
        'The room is already reserved for the selected dates',
      );
    }

    return this.reservationModel.create({
      room: createReservationDto.roomId,
      user: userId,
      startDate: createReservationDto.startDate,
      endDate: createReservationDto.endDate,
      active: true,
    });
  }

  async preBooking(data: preBookingDTO) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (data.endDate <= data.startDate) {
      throw new BadRequestException(
        'The check-out date must be after the check-in date',
      );
    }

    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    let costTotal = 0;
    const listRooms: Room[] = [];

    for (const roomId of data.roomsId) {
      const reservationDTO = {
        roomId,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      if (!(await this.checkAvailability(reservationDTO))) {
        throw new ConflictException(
          `Room ${roomId} is already reserved for the selected dates`,
        );
      }

      const room = await this.roomModel.findById(roomId);
      if (!room) {
        throw new NotFoundException(`Room ${roomId} not found`);
      }

      costTotal += room.price * nights;
      listRooms.push(room);
    }

    return {
      validated: true,
      checkInDate: data.startDate,
      checkOutDate: data.endDate,
      roomsSelected: listRooms,
      nightsCount: nights,
      baseCost: costTotal,
      promotionsApplied: [],
      estimatedDiscount: 0,
      finalCost: costTotal,
      cancellationPolicy: 'Cancellation 3 days before the reservation date.',
    };
  }
}
