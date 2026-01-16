import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateEquipmentDto {
  @IsNotEmpty()
  @IsString()
  EquipmentName: string;

  @IsOptional()
  @IsString()
  EquipmentType?: string;

  @IsOptional()
  @IsString()
  SerialNumber?: string;

  @IsOptional()
  @IsString()
  ModelNumber?: string;

  @IsOptional()
  @IsString()
  Manufacturer?: string;

  @IsOptional()
  @IsDateString()
  ManufacturingDate?: string;

  @IsOptional()
  @IsDateString()
  InstallationDate?: string;

  @IsOptional()
  @IsString()
  Location?: string;

  @IsOptional()
  @IsNumber()
  Capacity?: number;

  @IsOptional()
  @IsString()
  CapacityUnit?: string;

  @IsOptional()
  @IsString()
  Status?: string;

  @IsOptional()
  @IsString()
  Description?: string;

  @IsOptional()
  @IsDateString()
  LastInspectionDate?: string;

  @IsOptional()
  @IsDateString()
  NextInspectionDate?: string;

  @IsOptional()
  @IsNumber()
  CompanyId?: number;
}
