import { Body, Controller, Get, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminSigninDto } from './dto/admin-signin.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {  UserSignupDto } from './dto/user-signup.dto';
import { UserSigninDto } from './dto/user-sigin.dto';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/auth/admin/signin')
  @ApiBody({
    description: 'This API Endpoint is used to sign in with bearer auth.',
    schema: {
      type: 'object',
      properties: { email: { type: 'string' }, password: { type: 'string' } },
    },
  })
  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'Admin Signin Successfully.',
      user: {},
    },
  })
  async login(@Body() adminSigninBody: AdminSigninDto) {
    return this.authService.adminSignin(adminSigninBody);
  }

  @Post('/auth/admin/signup')
  @ApiBody({
    description: 'This API Endpoint is used to sign Up with bearer auth.',
    schema: {
      type: 'object',
      properties: { email: { type: 'string' }, password: { type: 'string' } },
    },
  })
  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'Admin Signup Successfully.',
      user: {},
    },
  })
  async signUp(@Body() adminSignupBody: AdminSignupDto) {
    return this.authService.adminSignup(adminSignupBody);
  }

  @Post("/user/signup")
  async userSignup(@Body() userSignUpBody: UserSignupDto) {
    return this.authService.userSignUp(userSignUpBody);
  }

  @Post("/user/signin")
  async userSignin(@Body() userSigninBody: UserSigninDto) {
    return this.authService.userSignin(userSigninBody);
  }
  
  @Get("/user")
  @UseGuards(AuthGuard)
  async getUserDetails(@Query("userId",ParseUUIDPipe) userId: string) {
    return this.authService.getUserDetails(userId);
  }

  
}
