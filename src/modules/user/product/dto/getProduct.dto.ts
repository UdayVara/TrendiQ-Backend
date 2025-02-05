import { gender } from "@prisma/client";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class getProductDto {
    @IsString()
    page: string;

    @IsString()
    size:string;

    @IsString()
    @IsOptional()
    search:string

    @IsOptional()
    @IsString()
    categoryId:string;

    @IsString()
    @IsOptional()
    gender:string;
}