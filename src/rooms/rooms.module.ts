import { Module } from '@nestjs/common';
import { HotelsModule } from 'src/hotels/hotels.module';
import { RoomsService } from './rooms.service';
import { RoomMapper } from './mappers/rooms.mapper';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schema';
import { RoomsController } from './rooms.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    HotelsModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomMapper],
  exports: [RoomsService],
})
export class RoomsModule {}
