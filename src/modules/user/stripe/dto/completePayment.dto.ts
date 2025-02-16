import { IsNotEmpty, IsString} from "class-validator";

export class CompletePaymentDto {
    @IsString()
    @IsNotEmpty()
    intentId: string;
    
    @IsString()
    @IsNotEmpty()
    shippingId: string;
    
}