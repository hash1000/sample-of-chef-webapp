import { IsIn, IsOptional, IsString, Max, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ChefOrdersQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'accepted', 'preparing', 'dispatched', 'completed', 'ready', 'delivered'])
  status?: 'pending' | 'accepted' | 'preparing' | 'dispatched' | 'completed' | 'ready' | 'delivered';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

