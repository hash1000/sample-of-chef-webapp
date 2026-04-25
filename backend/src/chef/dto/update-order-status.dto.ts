import { IsIn, IsString } from 'class-validator';

export class UpdateChefOrderStatusDto {
  @IsString()
  @IsIn(['accepted', 'preparing', 'ready'])
  status!: 'accepted' | 'preparing' | 'ready';
}

