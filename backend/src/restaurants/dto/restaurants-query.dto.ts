import { Transform } from 'class-transformer';
import { City } from '@prisma/client';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class RestaurantsQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn([City.islamabad, City.karachi, City.lahore])
  city?: City;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
