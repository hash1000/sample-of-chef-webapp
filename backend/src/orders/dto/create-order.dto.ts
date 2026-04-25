import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  // cents
  @IsInt()
  @Min(0)
  unitPrice!: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  restaurantId?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  // cents
  @IsInt()
  @Min(0)
  deliveryFee!: number;
}

