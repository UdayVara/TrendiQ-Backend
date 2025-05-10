import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  @ApiProperty({type:"string",example:"PjG2z@example.com"})
  email: string;

  @IsNotEmpty()
  @ApiProperty({type:"string",example:"Test@1234",description:"Password should be at least 8 characters should contain alteast one number and one character and one special character."})
  password: string;

  @IsString()
  @ApiProperty({type:"string",example:"Test User"})
  username: string;

  @IsString()
  @ApiProperty({type:"string",example:"dsfsdfsdfsdfewrerwec",description:"Optional FCM token for notification in android and ios devices."})
  fcmToken: string;
}