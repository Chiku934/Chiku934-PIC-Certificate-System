import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LetterHeadService } from '../services/letter-head.service';
import { LetterHead } from '../entities/letter-head.entity';

@Controller('letter-heads')
export class LetterHeadController {
  constructor(private readonly letterHeadService: LetterHeadService) {}

  @Get()
  findAll() {
    return this.letterHeadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.letterHeadService.findOne(+id);
  }

  @Post()
  create(@Body() letterHead: LetterHead) {
    return this.letterHeadService.create(letterHead);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() letterHead: LetterHead) {
    return this.letterHeadService.update(+id, letterHead);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.letterHeadService.remove(+id);
  }
}
