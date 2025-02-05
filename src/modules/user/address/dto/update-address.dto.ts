import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './create-address.dto';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    addressId:string;
}
