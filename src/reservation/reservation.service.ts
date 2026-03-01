import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { Model } from 'mongoose';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { PreBookingDTO } from './dto/pre-booking.dto';
import { Room, RoomDocument } from 'src/rooms/schemas/room.schema';
import {
  FestiveCalendar,
  FestiveCalendarDocument,
} from 'src/festive-calendar/schmes/festive.calendar.schema';
import { states } from './enum/states.reservation';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
    @InjectModel(FestiveCalendar.name)
    private readonly festiveModel: Model<FestiveCalendarDocument>,
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
    const startDate = new Date(createReservationDto.startDate);
    const endDate = new Date(createReservationDto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('Invalid date range');
    }

    const available = await this.checkAvailability(createReservationDto);
    if (!available) {
      throw new ConflictException(
        'The room is already reserved for the selected dates',
      );
    }

    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const room = await this.roomModel.findById(createReservationDto.roomId);
    if (!room) {
      throw new NotFoundException(
        `Room ${createReservationDto.roomId} not found`,
      );
    }

    const costTotal = room.price * nights;
    let discount = 0;
    const appliedPromos: string[] = [];

    if (createReservationDto.childCount > 0) {
      appliedPromos.push('Children under 5 free');
    }

    if (createReservationDto.adultCount > 8) {
      const groupDiscount = costTotal * 0.15;
      discount += groupDiscount;
      appliedPromos.push('Large group discount (15%)');
    }

    const festivePromo = await this.festiveModel.findOne({
      locationId: room.hotel,
      date: {
        $gte: new Date(startDate.setHours(0, 0, 0, 0)),
        $lte: new Date(startDate.setHours(23, 59, 59, 999)),
      },
    });

    if (festivePromo) {
      const festiveDiscount =
        costTotal * (festivePromo.discountPercentage / 100);
      discount += festiveDiscount;
      appliedPromos.push(`Local Holiday (${festivePromo.discountPercentage}%)`);
    }

    const finalCost = costTotal - discount;

    const reservation = await this.reservationModel.create({
      room: createReservationDto.roomId,
      user: userId,
      startDate,
      endDate,
      active: true,
      finalCost,
    });

    return {
      reservationId: reservation._id,
      room: reservation.room,
      checkIn: reservation.startDate,
      checkOut: reservation.endDate,
      baseCost: costTotal,
      discountApplied: discount,
      promotionsApplied: appliedPromos,
      finalCost: reservation.finalCost,
      status: reservation.status,
    };
  }

  /**
   * Calculates the estimated booking cost by validating room availability
   *  and applying all relevant promotions (children, large groups, and festive dates).
   *  Returns the final price along with the promotions applied.
   */
  async preBooking(data: PreBookingDTO) {
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

    let costTotal: number = 0;
    let discount: number = 0;
    const listRooms: Room[] = [];
    const appliedPromos: string[] = [];
    let hotelId: string | null = null;

    for (const roomId of data.roomsId) {
      const reservationDTO = {
        roomId,
        startDate: data.startDate,
        endDate: data.endDate,
        adultCount: data.adultCount,
        childCount: data.childCount,
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

      if (!hotelId) {
        hotelId = room.hotel.toString();
      } else if (hotelId !== room.hotel.toString()) {
        throw new BadRequestException(
          'All rooms must belong to the same hotel',
        );
      }

      costTotal += room.price * nights;
      listRooms.push(room);
    }

    if (data.childCount > 0) {
      appliedPromos.push('Niños menores de 5 años gratis');
    }

    if (data.adultCount != null && data.adultCount > 8) {
      const groupDiscount: number = costTotal * 0.15;
      discount += groupDiscount;
      appliedPromos.push('Descuento para grupos grandes (15%)');
    }

    const festivePromo = await this.festiveModel.findOne({
      locationId: hotelId,
      date: {
        $gte: new Date(startDate.setHours(0, 0, 0, 0)),
        $lte: new Date(startDate.setHours(23, 59, 59, 999)),
      },
    });

    if (festivePromo) {
      const festiveDiscount: number =
        costTotal * (festivePromo.discountPercentage / 100);
      discount += festiveDiscount;
      appliedPromos.push(
        `Dias de Fiesta local (${festivePromo.discountPercentage}%)`,
      );
    }

    const finalCost: number = costTotal - discount;
    return {
      validated: true,
      checkInDate: data.startDate,
      checkOutDate: data.endDate,
      roomsSelected: listRooms,
      nightsCount: nights,
      baseCost: costTotal,
      promotionsApplied: appliedPromos,
      estimatedDiscount: discount,
      finalCost: finalCost,
      cancellationPolicy:
        'Las reservas se pueden cancelar hasta tres días antes de la fecha de reserva.',
    };
  }

  /**
   * Validates that the user owns the reservation, checks that it exists,
   *  and ensures the cancellation is made at least 3 days before check-in.
   *  If valid, the reservation status is set to canceled.
   */
  async validateCancellation(idReservation: string, idUser: string) {
    const isValid = await this.validateUserReservation(idReservation, idUser);
    if (!isValid) {
      throw new ForbiddenException(
        'Only the person who registered the reservation can cancel it.',
      );
    }

    const reservation = await this.reservationModel.findById(idReservation);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const today = new Date();
    const checkIn = new Date(reservation.startDate);

    const diffMs = checkIn.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 3) {
      reservation.status = states.CANCELED;
      await reservation.save();
      return { message: 'Reservation canceled successfully.' };
    }

    throw new BadRequestException(
      'Cancellation rejected. You must cancel at least 3 days before check-in.',
    );
  }

  async validateUserReservation(
    idReservation: string,
    idUser: string,
  ): Promise<boolean> {
    const findReservation: Reservation | null =
      await this.reservationModel.findById(idReservation);
    if (!findReservation) {
      throw new NotFoundException('No reservation was found with that ID');
    }

    if (findReservation.user.toString() !== idUser) {
      return false;
    }

    return true;
  }

  async getReservationForUser(idUser: string) {
    const findReservations = await this.reservationModel
      .find({ user: idUser })
      .populate('room', 'name')
      .exec();

    type GroupedReservation = {
      checkIn: Date;
      checkOut: Date;
      rooms: { id: string; name: string }[];
      totalCost: number;
      status: states[];
    };

    const groupedReservations: Record<string, GroupedReservation> = {};

    for (const res of findReservations) {
      const start = res.startDate.toDateString();
      const end = res.endDate.toDateString();
      const key = `${start}-${end}`;

      if (!groupedReservations[key]) {
        groupedReservations[key] = {
          checkIn: res.startDate,
          checkOut: res.endDate,
          rooms: [],
          totalCost: 0,
          status: [],
        };
      }

      const room = res.room as unknown as { _id: string; name: string };

      groupedReservations[key].rooms.push({
        id: room._id.toString(),
        name: room.name,
      });
      groupedReservations[key].status.push(res.status);

      groupedReservations[key].totalCost += res.finalCost;
    }

    return Object.values(groupedReservations);
  }
}
