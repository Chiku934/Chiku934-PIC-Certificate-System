import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateCompanyDetailsDto {
  @IsNotEmpty()
  @IsString()
  CompanyName: string;

  @IsNotEmpty()
  @IsString()
  ABBR: string;

  @IsOptional()
  @IsString()
  CompanyLogo?: string;

  @IsOptional()
  @IsString()
  TaxId?: string;

  @IsOptional()
  @IsString()
  Domain?: string;

  @IsOptional()
  @IsDateString()
  DateOfEstablishment?: string;

  @IsOptional()
  @IsDateString()
  DateOfIncorporation?: string;

  @IsOptional()
  @IsString()
  AddressLine1?: string;

  @IsOptional()
  @IsString()
  AddressLine2?: string;

  @IsOptional()
  @IsString()
  City?: string;

  @IsOptional()
  @IsString()
  State?: string;

  @IsOptional()
  @IsString()
  Country?: string;

  @IsOptional()
  @IsString()
  PostalCode?: string;

  @IsOptional()
  @IsString()
  EmailAddress?: string;

  @IsOptional()
  @IsString()
  PhoneNumber?: string;

  @IsOptional()
  @IsString()
  Fax?: string;

  @IsOptional()
  @IsString()
  Website?: string;

  @IsNotEmpty()
  CreatedBy: number;
}
