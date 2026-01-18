import { IsOptional, IsString, IsBoolean, IsNumber, IsMongoId } from 'class-validator';

export class RoomDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsMongoId()
  hotel?: string;
}
