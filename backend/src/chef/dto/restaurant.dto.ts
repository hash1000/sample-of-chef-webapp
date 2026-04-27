import { City } from '@prisma/client';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateChefRestaurantDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsIn([City.islamabad, City.karachi, City.lahore])
  city?: City;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  menuType?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
