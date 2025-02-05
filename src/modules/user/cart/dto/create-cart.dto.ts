import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateCartDto {
    @IsString()
    @IsUUID()
    productId:string;

    @IsString()
    @IsUUID()
    inventoryId:string;

    @IsNumber()
    @IsNotEmpty()
    quantity:number;
}
