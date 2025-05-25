import { ApiProperty } from '@nestjs/swagger';
import { userSource } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserSigninDto {
  @IsEmail()
  @ApiProperty({
    type: 'string',
    description: 'User Email for Signin',
    example: 'test@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'User Password for Signin',
    example: 'test@1234',
  })
  password: string;

  @ApiProperty({
    type:"enum",
    enum:userSource,
    description: 'User Source for Signin',
    example: 'web',
  })
  @IsNotEmpty()
  @IsEnum(userSource)
  source: userSource;


  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'dsfsdfsdfsdfewrerwec',
    description:
      'Optional FCM token for notification in android and ios devices.',
  })
  fcmToken: string;
}
