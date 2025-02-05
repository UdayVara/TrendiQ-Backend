import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  username: string;

}