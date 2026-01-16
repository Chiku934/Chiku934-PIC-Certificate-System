import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EquipmentModule } from './modules/equipment.module';
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';
import { Equipment } from './entities/equipment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'DRS@2026',
      password: 'DRS@2026',
      database: 'PIC_Certificates_Angular',
      entities: [User, Company, Equipment],
      synchronize: true,
      options: {
        encrypt: false, // for local
      },
    }),
    EquipmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
