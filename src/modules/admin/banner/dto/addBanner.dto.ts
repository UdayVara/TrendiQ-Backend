import { gender } from "@prisma/client";
import { IsEnum } from "class-validator";

export class AddBannerDto {
    @IsEnum(gender)
    gender: gender;
    
}