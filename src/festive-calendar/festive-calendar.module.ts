import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FestiveCalendar,
  FestiveCalendarSChema,
} from './schmes/festive.calendar.schema';
import { FestiveCalendarService } from './festive-calendar.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FestiveCalendar.name, schema: FestiveCalendarSChema },
    ]),
  ],
  providers: [FestiveCalendarService],
  exports: [FestiveCalendarService],
})
export class FestiveCalendarModule {}
