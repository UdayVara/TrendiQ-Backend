import { gender } from "@prisma/client";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProductDto {

    @IsString()
    title:string;

    @IsString()
    description?:string

    @IsOptional()
    @IsString()
    markupDescription?:string

    @IsUUID()
    @IsString()
    categoryId:string;

    @IsUUID()
    @IsString()
    sizeId:string;

    @IsString()
    price:number;

    @IsString()
    discount :number

    @IsString()
    stock :number

    @IsString() 
    minimumStock:number

    @IsEnum(gender)
    gender:string;

    @IsString()
    isTrending : string;

    @IsString()
    color:string;
}
