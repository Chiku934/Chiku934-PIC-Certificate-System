import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  Email: string;

  @IsNotEmpty()
  @MinLength(6)
  Password: string;

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
  @IsPhoneNumber()
  PhoneNumber?: string;

  @IsOptional()
  @IsString()
  Address?: string;

  @IsOptional()
  @IsString()
  UserImage?: string;

  @IsNotEmpty()
  @IsString({ each: true })
  Roles: string[];

  @IsOptional()
  CreatedBy?: number;
}
