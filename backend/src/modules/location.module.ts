import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from '../services/location.service';
import { LocationController } from '../controllers/location.controller';
import { Location } from '../entities/location.entity';
import { Company } from '../entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Company])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
