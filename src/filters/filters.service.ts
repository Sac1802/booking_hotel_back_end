import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose'; // Added HydratedDocument
import { RoomCombination } from './interfaces/room.combination';
import {
  Reservation,
  ReservationDocument,
} from 'src/reservation/schemas/reservation.schema';
import { Room, RoomDocument } from 'src/rooms/schemas/room.schema';
import { Hotel } from 'src/hotels/schemas/hotel.schema';

import { Types } from 'mongoose';

type RoomWithId = Room & { _id: Types.ObjectId };

export type PopulatedRoomDocument = Omit<
  HydratedDocument<RoomWithId>,
  'hotel'
> & {
  hotel: HydratedDocument<Hotel> & { _id: Types.ObjectId };
};

@Injectable()
export class FiltersService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
  ) {}

  private results: RoomCombination[];

  async getRoomsAvailable(
    startDate: Date,
    endDate: Date,
  ): Promise<PopulatedRoomDocument[]> {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    const reservationRooms = await this.reservationModel
      .find({
        active: true,
        $or: [
          { startDate: { $lte: endDate, $gte: startDate } },
          { endDate: { $lte: endDate, $gte: startDate } },
          { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
        ],
      })
      .select('room')
      .exec();

    const reservationRoomIds = reservationRooms.map((r) => r.room.toString());
    const rooms = await this.roomModel
      .find({
        _id: { $nin: reservationRoomIds },
        isAvailable: true,
      })
      .populate('hotel')
      .exec();

    return rooms as unknown as PopulatedRoomDocument[];
  }

  async combinationRooms(
    startDate: Date,
    endDate: Date,
    capacity: number,
  ): Promise<RoomCombination[]> {
    const roomsAvailable = await this.getRoomsAvailable(startDate, endDate);
    this.results = [];

    this.validateBack(0, [], capacity, 0, 0, roomsAvailable);

    return this.results;
  }

  validateBack(
    start: number,
    combination: PopulatedRoomDocument[],
    capacity: number,
    priceTotal: number,
    totalCapacity: number,
    roomsAvailable: PopulatedRoomDocument[],
  ) {
    if (totalCapacity >= capacity) {
      this.results.push({
        rooms: [...combination],
        totalCapacity,
        totalPrice: priceTotal,
      });
      return;
    }

    for (let i = start; i < roomsAvailable.length; i++) {
      const room = roomsAvailable[i];
      this.validateBack(
        i + 1,
        [...combination, room],
        capacity,
        priceTotal + room.price,
        totalCapacity + room.capacity,
        roomsAvailable,
      );
    }
  }

  filterByCity(
    city: string,
    roomsAvailable: PopulatedRoomDocument[],
  ): PopulatedRoomDocument[] {
    const normalizedCity = city.trim().toLowerCase();

    return roomsAvailable.filter(
      (room) => room.hotel.city.trim().toLowerCase() === normalizedCity,
    );
  }

  filterByPrice(
    min: number,
    max: number,
    roomsAvailable: PopulatedRoomDocument[],
  ): PopulatedRoomDocument[] {
    return roomsAvailable.filter(
      (room) => room.price >= min && room.price <= max,
    );
  }

  validateDate(startDate: Date, endDate: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (start.getTime() < today.getTime() || end.getTime() < today.getTime()) {
      throw new BadRequestException('Enter a date later than the current date');
    }
  }

  async searchRooms(
    startDate: Date,
    endDate: Date,
    peopleCount: number,
    city?: string,
    minPrice?: number,
    maxPrice?: number,
  ) {
    this.validateDate(startDate, endDate);

    let roomsPool: PopulatedRoomDocument[] = await this.getRoomsAvailable(
      startDate,
      endDate,
    );

    if (city) {
      roomsPool = this.filterByCity(city, roomsPool);
    }

    if (minPrice != null && maxPrice != null) {
      roomsPool = this.filterByPrice(minPrice, maxPrice, roomsPool);
    }

    this.results = [];
    this.validateBack(0, [], peopleCount, 0, 0, roomsPool);

    return this.results.map((combo, index) => {
      const firstRoom = combo.rooms[0];
      const hotel = firstRoom.hotel;

      return {
        hotelId: hotel._id,
        hotelName: hotel.name,
        location: hotel.city,
        optionLabel: `Opción ${index + 1} (${peopleCount} Personas)`,
        rooms: combo.rooms.map((r) => ({
          id: r._id,
          type: r.name,
          price: r.price,
          capacity: r.capacity,
          description: r.description,
        })),
        totalPrice: combo.totalPrice,
        available: true,
      };
    });
  }
}
