
import {  IsBoolean, IsString, IsUUID } from 'class-validator';

export class UpdateStatusDto {
    @IsString()
    @IsUUID()
    productId:string
    
    @IsBoolean()
    isTrending : boolean
}
