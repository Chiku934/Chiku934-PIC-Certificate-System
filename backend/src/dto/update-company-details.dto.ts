import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDetailsDto } from './create-company-details.dto';

export class UpdateCompanyDetailsDto extends PartialType(
  CreateCompanyDetailsDto,
) {
  UpdatedBy?: number;
}
