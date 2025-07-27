import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString} from "class-validator";

export class CreatePaymentDto {
    @IsString()
    @ApiProperty({type:"string",example:"99is-sjjj-ssss-wwww"})
    @IsNotEmpty()
    shippingId: string;
}