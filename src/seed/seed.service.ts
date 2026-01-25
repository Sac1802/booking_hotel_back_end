import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument } from '../hotels/schemas/hotel.schema';
import { Room, RoomDocument } from '../rooms/schemas/room.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async executeSeed() {
    await this.hotelModel.deleteMany({});
    await this.roomModel.deleteMany({});

    const hotelsData = [
      {
        name: 'Grand Hyatt',
        address: '123 Luxury Ave',
        city: 'New York',
        country: 'USA',
        description: 'A luxurious hotel in the heart of the city.',
      },
      {
        name: 'Marriott City Center',
        address: '456 Urban Core',
        city: 'London',
        country: 'UK',
        description: 'Modern hotel perfect for business travelers.',
      },
      {
        name: 'Seaside Resort & Spa',
        address: '789 Beachfront Dr',
        city: 'Cancun',
        country: 'Mexico',
        description: 'All-inclusive resort with stunning ocean views.',
      },
    ];

    const createdHotels = await this.hotelModel.insertMany(hotelsData);

    const roomsData = [
      {
        name: 'Standard King',
        capacity: 2,
        isAvailable: true,
        price: 120,
        hotel: createdHotels[0]._id,
      },
      {
        name: 'Deluxe Suite',
        capacity: 4,
        isAvailable: true,
        price: 250,
        hotel: createdHotels[0]._id,
      },
      {
        name: 'Presidential Suite',
        capacity: 6,
        isAvailable: false,
        price: 500,
        hotel: createdHotels[0]._id,
      },

      {
        name: 'Executive Room',
        capacity: 2,
        isAvailable: true,
        price: 150,
        hotel: createdHotels[1]._id,
      },
      {
        name: 'Family Room',
        capacity: 5,
        isAvailable: true,
        price: 300,
        hotel: createdHotels[1]._id,
      },
      {
        name: 'Business Suite',
        capacity: 3,
        isAvailable: true,
        price: 220,
        hotel: createdHotels[1]._id,
      },

      {
        name: 'Ocean View Double',
        capacity: 4,
        isAvailable: true,
        price: 280,
        hotel: createdHotels[2]._id,
      },
      {
        name: 'Bungalow',
        capacity: 3,
        isAvailable: false,
        price: 200,
        hotel: createdHotels[2]._id,
      },
      {
        name: 'Garden View Single',
        capacity: 1,
        isAvailable: true,
        price: 90,
        hotel: createdHotels[2]._id,
      },
      {
        name: 'Penthouse',
        capacity: 8,
        isAvailable: true,
        price: 600,
        hotel: createdHotels[2]._id,
      },
    ];

    await this.roomModel.insertMany(roomsData);

    return {
      message: 'Database seeded successfully!',
      hotels: createdHotels.length,
      rooms: roomsData.length,
    };
  }
}
