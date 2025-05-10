import { IsNotEmpty, IsString } from "class-validator";

export class createSupportTicketDto {
    @IsNotEmpty()
    @IsString()
    subject: string;
    @IsNotEmpty()
    @IsString()
    message: string;
}