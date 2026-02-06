import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsNumber } from 'class-validator';
import { CreateEquipmentDto } from './create-equipment.dto';

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {
  @IsOptional()
  @IsNumber()
  UpdatedBy?: number;
}
