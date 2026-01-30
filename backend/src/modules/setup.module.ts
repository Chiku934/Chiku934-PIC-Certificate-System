import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupService } from '../services/setup.service';
import { FileUploadService } from '../services/file-upload.service';
import { SetupController } from '../controllers/setup.controller';
import { CompanyDetails } from '../entities/company-details.entity';
import { LetterHead } from '../entities/letter-head.entity';
import { EmailDomain } from '../entities/email-domain.entity';
import { EmailAccount } from '../entities/email-account.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyDetails,
      LetterHead,
      EmailDomain,
      EmailAccount,
      User,
    ]),
  ],
  controllers: [SetupController],
  providers: [SetupService, FileUploadService],
  exports: [SetupService, FileUploadService],
})
export class SetupModule {}
