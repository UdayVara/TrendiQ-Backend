import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString} from "class-validator";

export class CompletePaymentDto {
    @IsString()
    @ApiProperty({type:"string",example:"99is-sjjj-ssss-wwww"})
    @IsNotEmpty()
    transactionId: string;
}