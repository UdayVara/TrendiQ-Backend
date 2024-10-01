import { IsString } from "class-validator";

export class CreateEnviromentDto {

    @IsString()
    key:string;

    @IsString()
    value:string;
}
