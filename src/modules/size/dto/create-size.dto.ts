import { IsString, IsUUID } from "class-validator";

export class CreateSizeDto {

    @IsString()
    name:string;

    @IsString()
    description:string;

    @IsUUID()
    category:string;
}
