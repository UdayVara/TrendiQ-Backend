import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserSigninDto {
  @IsEmail()
  @ApiProperty({type:"string",description:"User Email for Signin",example:"test@gmail.com"})
  email: string;

  @IsNotEmpty()
  @ApiProperty({type:"string",description:"User Password for Signin",example:"test@1234"})
  password: string;
}
