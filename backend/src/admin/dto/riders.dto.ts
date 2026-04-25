import { RiderStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateRiderStatusDto {
  @IsEnum(RiderStatus)
  status!: RiderStatus;
}

