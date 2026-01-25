
export class CreateReservationDto {
    readonly room: string;
    readonly user: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly active: boolean;
  }
