import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateCartDto {
    @IsString()
    @IsUUID()
    @ApiProperty({type:"string",example:"99is-sjjj-ssss-wwww"})
    productId:string;

    @IsString()
    @IsUUID()
    @ApiProperty({type:"string",example:"99is-sjjj-ssss-wwww"})
    inventoryId:string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({type:"number",example:"1"})
    quantity:number;
}
