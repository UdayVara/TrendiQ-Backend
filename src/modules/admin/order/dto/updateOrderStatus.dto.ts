import { orderStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class UpdateOrderStatusDto{
    
    @IsNotEmpty()
    @IsUUID()
    orderId:string;

    @IsNotEmpty()
    @IsEnum(orderStatus)
    status:string
}