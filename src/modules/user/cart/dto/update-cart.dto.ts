import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsString, IsUUID} from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
    @IsString()
    @IsUUID()
    cartId:string
}
