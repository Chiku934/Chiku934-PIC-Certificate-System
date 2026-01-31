import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsEmail,
  Min,
  Max,
} from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  LocationName: string;

  @IsOptional()
  @IsString()
  LocationCode?: string;

  @IsOptional()
  @IsString()
  Address?: string;

  @IsOptional()
  @IsString()
  City?: string;

  @IsOptional()
  @IsString()
  State?: string;

  @IsOptional()
  @IsString()
  PinCode?: string;

  @IsOptional()
  @IsString()
  Country?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  Latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  Longitude?: number;

  @IsOptional()
  @IsString()
  LocationType?: string;

  @IsOptional()
  @IsString()
  ContactPerson?: string;

  @IsOptional()
  @IsString()
  ContactNumber?: string;

  @IsOptional()
  @IsEmail()
  ContactEmail?: string;

  @IsOptional()
  @IsString()
  Description?: string;

  @IsOptional()
  @IsBoolean()
  IsActive?: boolean;

  @IsOptional()
  @IsNumber()
  ParentLocationId?: number;

  @IsOptional()
  @IsNumber()
  CompanyId?: number;

  @IsOptional()
  @IsNumber()
  CreatedBy?: number;
}
