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
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';
import { Equipment } from './entities/equipment.entity';
import { Location } from './entities/location.entity';
import { Certificate } from './entities/certificate.entity';
import { EquipmentHistory } from './entities/equipment-history.entity';
import { MaintenanceSchedule } from './entities/maintenance-schedule.entity';

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
      ],
      synchronize: true,
      options: {
        encrypt: false, // for local
      },
    }),
    EquipmentModule,
    LocationModule,
    CertificateModule,
    UserModule,
    AuthModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
