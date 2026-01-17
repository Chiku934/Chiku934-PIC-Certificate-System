import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupService } from '../services/setup.service';
import { SetupController } from '../controllers/setup.controller';
import { CompanyDetails } from '../entities/company-details.entity';
import { LetterHead } from '../entities/letter-head.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyDetails, LetterHead, User])],
  controllers: [SetupController],
  providers: [SetupService],
  exports: [SetupService],
})
export class SetupModule {}
