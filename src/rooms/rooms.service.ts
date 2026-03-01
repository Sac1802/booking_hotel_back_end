import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { RoomDTO } from './dto/room.dto';
import { RoomMapper } from './mappers/rooms.mapper';
import { Model, Types } from 'mongoose';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private RoomModel: Model<RoomDocument>,
    private romMapper: RoomMapper,
  ) {}

  async createRoom(room: RoomDTO) {
    const convertRoom = await this.romMapper.convertDTOToRoom(room, new Room());
    const newRoom = new this.RoomModel(convertRoom);
    const roomSaved = await newRoom.save();
    return this.romMapper.convertRoomToDTO(roomSaved);
  }

  async getById(id: string) {
    const findRoom = await this.RoomModel.findById(id);
    if (!findRoom) {
      throw new NotFoundException('Room not found');
    }
    return findRoom;
  }

  async getAllRoom() {
    const allRooms = await this.RoomModel.find();
    return allRooms;
  }

  async updateRoom(id: string, data: RoomDTO) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid room id');
    }

    const roomUpdate = await this.RoomModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!roomUpdate) {
      throw new NotFoundException('Room not found');
    }

    return roomUpdate;
  }

  async deleteRoom(id: string) {
    await this.RoomModel.findByIdAndDelete(id);
    return 'delete succesfully';
  }

  async getAllRoomsByHotelId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      return [];
    }

    return await this.RoomModel.find({
      hotel: new Types.ObjectId(id),
    }).exec();
  }
}
