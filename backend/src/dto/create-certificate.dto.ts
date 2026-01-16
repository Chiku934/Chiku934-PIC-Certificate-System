import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  IsPositive,
  MinLength,
  MaxLength,
} from 'class-validator';
import {
  CertificateType,
  CertificateStatus,
} from '../entities/certificate.entity';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class CreateCertificateDto {
  @IsNotEmpty()
  @IsEnum(CertificateType)
  CertificateType: CertificateType;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  CertificateNumber: string;

  @IsOptional()
  @IsEnum(CertificateStatus)
  Status?: CertificateStatus;

  @IsNotEmpty()
  @IsDateString()
  IssueDate: string;

  @IsNotEmpty()
  @IsDateString()
  ExpiryDate: string;

  @IsOptional()
  @IsDateString()
  InspectionDate?: string;

  @IsOptional()
  @IsDateString()
  NextInspectionDate?: string;

  @IsOptional()
  @IsString()
  InspectionNotes?: string;

  @IsOptional()
  @IsString()
  CertificateDetails?: string;

  @IsOptional()
  @IsString()
  IssuedBy?: string;

  @IsOptional()
  @IsString()
  ApprovedBy?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  Capacity?: number;

  @IsOptional()
  @IsString()
  CapacityUnit?: string;

  @IsOptional()
  @IsString()
  SpecialConditions?: string;

  @IsOptional()
  @IsString()
  RejectionReason?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  EquipmentId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  LocationId: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  CreatedById?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  ApprovedById?: number;
}
