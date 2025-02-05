import { IsNotEmpty, IsString,  MinLength } from "class-validator";

export class CreateAddressDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    pincode:string;


    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    name:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    address:string;
}
