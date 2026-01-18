import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { hotelDTO } from './dto/hotel.dto';
import { HotelMapper } from './mappers/hotel.mapper';
import { Model, Types } from 'mongoose';

@Injectable()
export class HotelsService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(HotelDTO: hotelDTO) {
    const convertHotel = HotelMapper.convertDTOToHotel(HotelDTO, new Hotel());
    const newHotel = new this.hotelModel(convertHotel);
    const hotelSaved = await newHotel.save();
    return HotelMapper.convertHotelToDTO(hotelSaved);
  }

  async getById(id: string) {
    const findHotel = await this.hotelModel.findById(id);
    if (!findHotel) {
      throw new NotFoundException('Hotel not found');
    }

    return findHotel;
  }

  async getAllHotel() {
    const finAllHotels = await this.hotelModel.find();
    return finAllHotels;
  }

  async updateHotelById(id: string, data: hotelDTO) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid hotel id');
    }
    const hotelUpdate = await this.hotelModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!hotelUpdate) {
      throw new NotFoundException('Hotel not found');
    }

    return hotelUpdate;
  }

  async deleteById(id: string) {
    await this.hotelModel.findByIdAndDelete(id);
    return 'delete succesfully';
  }

  async getByName(name: string) {
    const findHotelName = await this.hotelModel.findOne({ name: name });
    return findHotelName;
  }
}
