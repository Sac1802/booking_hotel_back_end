import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hotel } from '../../hotels/schemas/hotel.schema';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  isAvailable: boolean;

  @Prop({ type: Types.ObjectId, ref: Hotel.name, required: true })
  hotel: Types.ObjectId;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
