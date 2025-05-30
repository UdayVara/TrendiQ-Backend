import { IsNotEmpty, IsString} from "class-validator";

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    shippingId: string;
}