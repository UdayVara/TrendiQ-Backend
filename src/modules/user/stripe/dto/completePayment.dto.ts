import { IsNotEmpty, IsString} from "class-validator";

export class CompletePaymentDto {
    @IsString()
    @IsNotEmpty()
    transactionId: string;
}