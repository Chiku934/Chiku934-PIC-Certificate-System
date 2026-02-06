import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  Email?: string;

  @IsOptional()
  @MinLength(6)
  Password?: string;

  @IsOptional()
  @IsString()
  FirstName?: string;

  @IsOptional()
  @IsString()
  MiddleName?: string;

  @IsOptional()
  @IsString()
  LastName?: string;

  @IsOptional()
  @IsString()
  PhoneNumber?: string;

  @IsOptional()
  @IsString()
  Address?: string;

  @IsOptional()
  @IsString()
  UserImage?: string;

  @IsOptional()
  @IsString({ each: true })
  Roles?: string[];

  @IsOptional()
  IsActive?: boolean;

  @IsOptional()
  UpdatedBy?: number;
}
