import { PartialType } from '@nestjs/swagger';
import {  IsString, IsUUID } from 'class-validator';
import { AddProductInventoryDto } from './addInventory.dto';

export class UpdateProductInventoryDto extends PartialType(AddProductInventoryDto) {
    @IsString()
    @IsUUID()
    inventoryId:string
}
