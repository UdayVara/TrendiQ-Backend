import { Body, Controller, Get,  Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminSigninDto } from './dto/admin-signin.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {  UserSignupDto } from './dto/user-signup.dto';
import { UserSigninDto } from './dto/user-sigin.dto';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';
import { UserUpdatePasswordDto } from './dto/user-update-password.dto';
import { DeleteUserFromEmail } from './dto/deleteUserByEmail.dto';


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
  @ApiTags("User Auth")
  @ApiBody({
    description:"Payload for user signup",
    type:UserSignupDto
  })
  @ApiOperation({
    summary: 'User Signup',
    description: 'This endpoint is used to create new user',
  })
  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'User Signup Successfully.',
      user: {},
      token:"Bearer token here"
    },
  })
  async userSignup(@Body() userSignUpBody: UserSignupDto) {
    return this.authService.userSignUp(userSignUpBody);
  }

  @Post("/user/signin")
  @ApiTags("User Auth")
  @ApiBody({
    description:"Payload for User Sign in",
    type:UserSigninDto
  })
  @ApiOperation({
    summary: 'User Signin',
    description: 'This endpoint is used to signin user',
  })
  @ApiOkResponse({
    example: {
      statusCode: 201,
      message: 'User Signin Successfully.',
      user: {},
      token:"Bearer token here"
    },
  })
  async userSignin(@Body() userSigninBody: UserSigninDto) {
    return this.authService.userSignin(userSigninBody);
  }
  
  @Get("/user/get-user-details")
  @ApiTags("User Auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get User Details',
    description: 'This endpoint retrieves a details of user including no of orders count', 
  })
  @ApiOkResponse({
    example: {
      statusCode: 201,
      message: 'User Details Fetched Successfully.',
      data: {},
    },
  })
  async getUserDetails(@Req() req: any) {
    return this.authService.getUserDetails(req.user.id);
  }

  @Post("/user/update-password")
  @ApiTags("User Auth")
  @UseGuards(AuthGuard)
  @ApiBody({
    description:"Payload for User Update Password",
    type:UserUpdatePasswordDto
  })
  @ApiOperation({
    summary: 'Update User Password',
    description: 'This endpoint is used to update user password',
  })
  async updatePassword(@Req() req: any, @Body() body: UserUpdatePasswordDto) {
    if(!req.user.id){
      throw new UnauthorizedException();
    }
    return this.authService.updatePassword( req.user.id,body);
  }

  @Post("/user/user-delete")
  @ApiTags("User Auth")
  @ApiBody({
    description:"Payload for User Delete",
    type:DeleteUserFromEmail
  })
  @ApiOperation({
    summary: 'Delete User by Email, this endpoint is only for development purpose',
  })
  async deleteUserByEmail(@Body() deleteUserFromEmail: DeleteUserFromEmail) {
    return this.authService.deleteUserFromEmail(deleteUserFromEmail);
  }
}
