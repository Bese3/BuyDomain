import { IsString, IsEmail, IsNotEmpty, IsArray, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  domain: string;

  @IsDateString()
  purchaseDate: string;
}
