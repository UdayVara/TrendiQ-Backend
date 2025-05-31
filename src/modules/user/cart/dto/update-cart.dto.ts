import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsString, IsUUID} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto extends PartialType(CreateCartDto) {
    @IsString()
    @IsUUID()
    @ApiProperty({type:"string",example:"99is-sjjj-ssss-wwww"})
    cartId:string
}
