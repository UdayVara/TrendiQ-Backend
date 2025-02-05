import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class AddProductInventoryDto {


    @IsUUID()
    @IsString()
    sizeId:string;

    @IsNumber()
    @IsNotEmpty()
    price:number;

    @IsNumber()
    @IsNotEmpty()
    discount :number

    @IsNumber()
    @IsNotEmpty()
    stock :number

    @IsNumber()
    @IsNotEmpty() 
    minimumStock:number

}
