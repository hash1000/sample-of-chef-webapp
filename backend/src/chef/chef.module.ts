import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChefController } from './chef.controller';
import { ChefService } from './chef.service';

@Module({
  controllers: [ChefController],
  providers: [PrismaService, ChefService],
})
export class ChefModule {}

