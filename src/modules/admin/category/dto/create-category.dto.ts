import { gender } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    name:string;

    @IsString()
    description:string; 

    @IsEnum(gender)
    gender:gender;
}
