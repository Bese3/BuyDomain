import { IsString, IsNotEmpty, IsEmail, IsDateString, IsBoolean, IsArray, IsDate, IsObject } from "class-validator";

export class CreatePurchaseServiceDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    id: string;
  
    @IsArray()
    domains: Array<{
        name: string;
        price: number;
    }>

    @IsBoolean()
    verified: boolean;
    
    @IsBoolean()
    user_verified: boolean;

    @IsDate()
    checkoutDate: string

    @IsDate()
    purchasedDate: string;
    
}
