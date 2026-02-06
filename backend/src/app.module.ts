import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EquipmentModule } from './modules/equipment.module';
import { LocationModule } from './modules/location.module';
import { CertificateModule } from './modules/certificate.module';
import { UserModule } from './modules/user.module';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './modules/seeder.module';
import { SetupModule } from './modules/setup.module';
import { LetterHeadModule } from './modules/letter-head.module';
import { FileUploadService } from './services/file-upload.service';
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';
import { Equipment } from './entities/equipment.entity';
import { Location } from './entities/location.entity';
import { Certificate } from './entities/certificate.entity';
import { EquipmentHistory } from './entities/equipment-history.entity';
import { MaintenanceSchedule } from './entities/maintenance-schedule.entity';
import { Role } from './entities/role.entity';
import { UserRoleMapping } from './entities/user-role-mapping.entity';
import { Application } from './entities/application.entity';
import { RoleAndApplicationWisePermission } from './entities/role-and-application-wise-permission.entity';
import { AuditLog } from './entities/audit-log.entity';
import { LetterHead } from './entities/letter-head.entity';
import { EmailDomain } from './entities/email-domain.entity';
import { EmailAccount } from './entities/email-account.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'DRS@2026',
      password: 'DRS@2026',
      database: 'PIC_Certificates_Angular',
      entities: [
        User,
        Company,
        Equipment,
        Location,
        Certificate,
        EquipmentHistory,
        MaintenanceSchedule,
        Role,
        UserRoleMapping,
        Application,
        RoleAndApplicationWisePermission,
        AuditLog,
        LetterHead,
        EmailDomain,
        EmailAccount,
      ],
      synchronize: false,
      options: {
        encrypt: false, // for local
        trustServerCertificate: true, // Add this to trust self-signed certificates
      },
      extra: {
        trustServerCertificate: true, // Additional option for mssql driver
      },
    }),
    EquipmentModule,
    LocationModule,
    CertificateModule,
    UserModule,
    AuthModule,
    SeederModule,
    SetupModule,
    LetterHeadModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileUploadService],
})
export class AppModule {}
