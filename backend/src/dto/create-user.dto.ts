import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  UserName: string;

  @IsEmail()
  Email: string;

  @IsNotEmpty()
  @MinLength(6)
  Password: string;

  @IsString()
  FirstName?: string;

  @IsString()
  LastName?: string;

  @IsString()
  PhoneNumber?: string;
}
