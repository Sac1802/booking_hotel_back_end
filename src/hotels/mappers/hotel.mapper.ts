import { HotelDocument } from '../schemas/hotel.schema';
import { hotelDTO } from '../dto/hotel.dto';
import { Hotel } from '../schemas/hotel.schema';

export class HotelMapper {
  static convertDTOToHotel(dto: hotelDTO, hotel: Hotel): Hotel {
    if (dto.name !== undefined) hotel.name = dto.name;
    if (dto.address !== undefined) hotel.address = dto.address;
    if (dto.city !== undefined) hotel.city = dto.city;
    if (dto.description !== undefined) hotel.description = dto.description;
    if (dto.isActive !== undefined) hotel.isActive = dto.isActive;
    if (dto.country !== undefined) hotel.country = dto.country;

    return hotel;
  }

  static convertHotelToDTO(hotel: HotelDocument): hotelDTO {
    const dto = new hotelDTO();
    dto.name = hotel.name;
    dto.address = hotel.address;
    dto.city = hotel.city;
    dto.country = hotel.country;
    dto.description = hotel.description;
    dto.isActive = hotel.isActive;
    return dto;
  }
}
