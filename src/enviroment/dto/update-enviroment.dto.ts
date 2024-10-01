import { IsString } from "class-validator";


export class UpdateEnviromentDto {
    @IsString()
    key:string;

    @IsString()
    value:string;

    @IsString()
    id:string;
}
