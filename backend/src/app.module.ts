import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'DRS@2026',
      password: 'DRS@2026',
      database: 'PIC_Certificates_Angular',
      entities: [],
      synchronize: true,
      options: {
        encrypt: false, // for local
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
