import { RoomDTO } from '../dto/room.dto';
import { Room } from '../schemas/room.schema';
import { HotelsService } from 'src/hotels/hotels.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RoomMapper {
  constructor(private hotelsService: HotelsService) {}
  async convertDTOToRoom(dto: RoomDTO, room: Room): Promise<Room> {
    if (dto.name !== undefined) room.name = dto.name;
    if (dto.capacity !== undefined) room.capacity = dto.capacity;
    if (dto.hotel !== undefined) {
      const hotelFind = await this.hotelsService.getByName(dto.hotel);
      if (!hotelFind) {
        throw new NotFoundException('Hotel not found');
      }
      room.hotel = hotelFind._id;
    }
    if (dto.isAvailable !== undefined) room.isAvailable = dto.isAvailable;
    if (dto.price !== undefined) room.price = dto.price;
    return room;
  }

  convertRoomToDTO(room: Room): RoomDTO {
    const newRoom = new RoomDTO();
    newRoom.name = room.name;
    newRoom.capacity = room.capacity;
    newRoom.hotel = room.hotel.toString();
    newRoom.isAvailable = room.isAvailable;
    return newRoom;
  }
}
