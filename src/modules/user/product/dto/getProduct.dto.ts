import { gender } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

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
    @IsEnum(gender)
    gender:string;

    @IsOptional()
    @IsEmail()
    userEmail:string;
}