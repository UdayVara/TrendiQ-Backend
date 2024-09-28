import {  Body, Controller, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import { AdminSigninDto } from './dto/admin-signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post("/admin/signin")
  async login(@Body() adminSigninBody: AdminSigninDto) {
    return this.authService.adminSignin(adminSigninBody)
  }


  @Post("/admin/signup")
  async signUp(@Body() adminSignupBody: AdminSignupDto) {
    return this.authService.adminSignup(adminSignupBody)
  }
}
