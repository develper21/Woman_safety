import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateIncidentDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  location?: {
    latitude: number;
    longitude: number;
  };
}
