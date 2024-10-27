import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminSigninDto } from './dto/admin-signin.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/admin/signin')
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

  @Post('/admin/signup')
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
}
