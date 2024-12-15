import { IsString, IsEmail, IsNotEmpty, IsArray, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsArray()
  domains: Array<string>;

  @IsDateString()
  purchaseDate: string;
}
