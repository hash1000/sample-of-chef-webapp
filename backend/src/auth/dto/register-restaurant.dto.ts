import { City } from '@prisma/client';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsNotEmpty()
  restaurantName!: string;

  @IsIn([City.islamabad, City.karachi, City.lahore])
  city!: City;

  @IsString()
  @IsNotEmpty()
  menuType!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
