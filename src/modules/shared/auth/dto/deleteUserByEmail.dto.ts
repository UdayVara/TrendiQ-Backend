import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class DeleteUserFromEmail{
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type:"string",example:"PjG2z@example.com"})
    email:string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type:"string",example:"dsfsdfsdfsdfewrerwec"})
    devToken:string
}