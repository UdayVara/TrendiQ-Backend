import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminSigninDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

}