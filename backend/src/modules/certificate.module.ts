import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateService } from '../services/certificate.service';
import { CertificateController } from '../controllers/certificate.controller';
import { Certificate } from '../entities/certificate.entity';
import { Equipment } from '../entities/equipment.entity';
import { Location } from '../entities/location.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Equipment, Location, User])],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
