import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from '../hotels/schemas/hotel.schema';
import { Room, RoomSchema } from '../rooms/schemas/room.schema';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
