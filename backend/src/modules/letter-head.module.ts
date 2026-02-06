import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LetterHeadController } from '../controllers/letter-head.controller';
import { LetterHeadService } from '../services/letter-head.service';
import { LetterHead } from '../entities/letter-head.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LetterHead])],
  controllers: [LetterHeadController],
  providers: [LetterHeadService],
  exports: [LetterHeadService],
})
export class LetterHeadModule {}
