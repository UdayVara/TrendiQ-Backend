import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AdminSigninDto } from './dto/admin-signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async adminSignup(adminSignupBody: AdminSignupDto) {
    try {
      const checkUser = await this.prisma.admin.findFirst({
        where: {
          email: adminSignupBody.email,
        },
      });

      if (checkUser) {
        throw new UnauthorizedException('User With Email Already Exists');
      } else {
        const hashedPass = bcrypt.hashSync(adminSignupBody.password, 10);
        const newUser = await this.prisma.admin.create({
          data: {
            password: hashedPass,
            email: adminSignupBody.email,
            username: adminSignupBody.username,
          },
        });

        if (newUser) {
          const token = this.jwtService.sign({
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
          });

          return {
            statusCode: 201,
            message: 'Admin Signup Successfully.',
            token,
          };
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }
  async adminSignin(adminSigninBody: AdminSigninDto) {
    try {
      const checkUser = await this.prisma.admin.findFirst({
        where: {
          email: adminSigninBody.email,
        },
      });

      if (!checkUser) {
        throw new UnauthorizedException('User With Email Does Not Exists');
      } else {
        const chckPass = bcrypt.compareSync(
          adminSigninBody.password,
          checkUser.password,
        );

        if (chckPass) {
          const token = this.jwtService.sign({
            id: checkUser.id,
            email: checkUser.email,
            username: checkUser.username,
          });

          return {
            statusCode: 201,
            message: 'Admin Signin Successfully.',
            token,
          };
        }else{
            throw new UnauthorizedException("Invalid Password")
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }
}
