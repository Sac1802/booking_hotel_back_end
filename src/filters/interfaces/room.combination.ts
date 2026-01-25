import { PopulatedRoomDocument } from '../filters.service';

export interface RoomCombination {
  rooms: PopulatedRoomDocument[];
  totalCapacity: number;
  totalPrice: number;
}
