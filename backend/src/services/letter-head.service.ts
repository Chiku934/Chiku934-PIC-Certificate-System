import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LetterHead } from '../entities/letter-head.entity';

@Injectable()
export class LetterHeadService {
  constructor(
    @InjectRepository(LetterHead)
    private letterHeadRepository: Repository<LetterHead>,
  ) {}

  async findAll(): Promise<LetterHead[]> {
    return this.letterHeadRepository.find();
  }

  async findOne(id: number): Promise<LetterHead> {
    return this.letterHeadRepository.findOne({ where: { Id: id } });
  }

  async create(letterHead: LetterHead): Promise<LetterHead> {
    return this.letterHeadRepository.save(letterHead);
  }

  async update(id: number, letterHead: LetterHead): Promise<LetterHead> {
    await this.letterHeadRepository.update(id, letterHead);
    return this.letterHeadRepository.findOne({ where: { Id: id } });
  }

  async remove(id: number): Promise<void> {
    await this.letterHeadRepository.delete(id);
  }
}
