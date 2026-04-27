import { City, RestaurantStatus } from '@prisma/client';
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn([City.islamabad, City.karachi, City.lahore])
  city!: City;

  @IsOptional()
  @IsString()
  chefId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  menuType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsIn([
    RestaurantStatus.pending,
    RestaurantStatus.approved,
    RestaurantStatus.rejected,
    RestaurantStatus.blocked,
  ])
  status?: RestaurantStatus;
}

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsIn([City.islamabad, City.karachi, City.lahore])
  city?: City;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  menuType?: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsIn([
    RestaurantStatus.pending,
    RestaurantStatus.approved,
    RestaurantStatus.rejected,
    RestaurantStatus.blocked,
  ])
  status?: RestaurantStatus;

  @IsOptional()
  @IsString()
  chefId?: string | null;
}

