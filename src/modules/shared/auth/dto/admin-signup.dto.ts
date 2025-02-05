import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminSignupDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  username: string;
}