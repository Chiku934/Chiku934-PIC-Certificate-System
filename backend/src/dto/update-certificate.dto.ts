import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsNumber } from 'class-validator';
import { CreateCertificateDto } from './create-certificate.dto';

export class UpdateCertificateDto extends PartialType(CreateCertificateDto) {
  @IsOptional()
  @IsNumber()
  UpdatedBy?: number;
}
