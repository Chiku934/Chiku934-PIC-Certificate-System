import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentDto } from './create-equipment.dto';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {}
