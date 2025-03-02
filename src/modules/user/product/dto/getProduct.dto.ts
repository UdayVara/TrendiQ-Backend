import { IsEmail, IsOptional, IsString } from "class-validator";

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

    @IsOptional()
    userEmail:string;
}