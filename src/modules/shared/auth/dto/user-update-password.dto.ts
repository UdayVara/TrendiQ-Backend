import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    MinLength,
    Matches,
  } from 'class-validator';
  
  export class UserUpdatePasswordDto {
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/[A-Za-z]/, { message: 'Password must contain at least one letter' })
    @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
    @Matches(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' })
    @ApiProperty({ type: 'string', example: 'Test@1234',description:"User's Current Password" })
    password: string;
  
    @IsString()
    @IsNotEmpty({ message: 'Confirm password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/[A-Za-z]/, { message: 'Password must contain at least one letter' })
    @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
    @Matches(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' })
    @ApiProperty({ type: 'string', example: 'Test@1234',description:"User's New Password" })
    newPassword: string;
  }
  