import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Room } from 'src/rooms/schemas/room.schema';
import { User } from 'src/users/schemas/user.schema';
import { states } from '../enum/states.reservation';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: Room.name, required: true })
  room: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: true })
  finalCost: number;

  @Prop({ type: String, enum: states, default: states.CONFIRMED })
  status: states;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.index({ room: 1 });
ReservationSchema.index({ startDate: 1, endDate: 1 });
ReservationSchema.index({ active: 1 });
