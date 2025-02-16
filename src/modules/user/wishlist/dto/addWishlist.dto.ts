import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class AddWishlistDto {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    productId: string;
}