import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hotel } from 'src/hotels/schemas/hotel.schema';

export type FestiveCalendarDocument = FestiveCalendar & Document;

@Schema({ timestamps: true })
export class FestiveCalendar {
  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: Hotel.name, required: true })
  locationId: Types.ObjectId;

  @Prop({ required: true })
  discountPercentage: number = 0.1;
}

export const FestiveCalendarSChema =
  SchemaFactory.createForClass(FestiveCalendar);
