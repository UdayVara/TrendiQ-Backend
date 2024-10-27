import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminSigninDto {
  @ApiProperty({type:"string",example:"PjG2z@example.com"})
  @IsEmail()
  email: string;

  @ApiProperty({type:"string",example:"Test@1234"})
  @IsNotEmpty()
  password: string;

}