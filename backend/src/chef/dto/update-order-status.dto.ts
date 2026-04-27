import { IsIn, IsString } from 'class-validator';

export class UpdateChefOrderStatusDto {
  @IsString()
  @IsIn(['accepted', 'preparing', 'dispatched', 'completed', 'ready'])
  status!: 'accepted' | 'preparing' | 'dispatched' | 'completed' | 'ready';
}

