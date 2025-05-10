import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AdminSignupDto } from './dto/admin-signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AdminSigninDto } from './dto/admin-signin.dto';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserSigninDto } from './dto/user-sigin.dto';
import { UserUpdatePasswordDto } from './dto/user-update-password.dto';

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
            user: checkUser,
          };
        } else {
          throw new UnauthorizedException('Invalid Password');
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }

  async userSignUp(userSignUpBody: UserSignupDto) {
    try {
      const res = await this.prisma.user.findFirst({
        where: {
          email: userSignUpBody.email,
        },
      });
      
      if (res) {
        throw new BadRequestException('User With Email Already Exists');
      } else {
        const hashedPass = bcrypt.hashSync(userSignUpBody.password, 10);
        const newUser = await this.prisma.user.create({
          data: {
            password: hashedPass,
            email: userSignUpBody.email,
            username: userSignUpBody.username,
            token: userSignUpBody?.fcmToken || null,
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
            message: 'User Signup Successfully.',
            token,
            user: newUser,
          };
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }

  async userSignin(userSigninBody: UserSigninDto) {
    try {
      const res = await this.prisma.user.findFirst({
        where: {
          email: userSigninBody.email,
        },
      });
      console.log(res);
      if (!res) {
        throw new BadRequestException('User With Email Does Not Exists');
      } else {
        const chckPass = bcrypt.compareSync(
          userSigninBody.password,
          res.password,
        );

        if (chckPass) {
          const token = this.jwtService.sign({
            id: res.id,
            email: res.email,
            username: res.username,
          });

          return {
            statusCode: 201,
            message: 'User Signin Successfully.',
            token,
            user: res,
          };
        } else {
          throw new InternalServerErrorException('Invalid Password');
        }
      }
    } catch (error) {
      console.log('Auth Error : ', error);
      throw new InternalServerErrorException(
        error.message || 'Internal Server Error',
      );
    }
  }

  async updatePassword(userId:string, userUpdatePasswordBody: UserUpdatePasswordDto) {
    try {
      console.log("User",userId)
      const res = await this.prisma.user.findFirst({
        where: {
          id:userId
        },
      });
      if (!res) {
        throw new BadRequestException('User With Email Does Not Exists');
      } else {
        const chckPass = bcrypt.compareSync(
          userUpdatePasswordBody.password,
          res.password,
        );

        if (chckPass) {
          const updatedHashedPassword = bcrypt.hashSync(userUpdatePasswordBody.newPassword, 10);
          await this.prisma.user.update({
            where:{
              id:userId
            },
            data:{
              password:updatedHashedPassword
            }
          })

          return {
            statusCode: 201,
            message: 'Password Updated Successfully',
          };
        } else {
          throw new InternalServerErrorException('Invalid Password');
        }
      }
    } catch (error) {
      console.log('Update Password Error : ', error);
      throw new InternalServerErrorException(
        error.message || 'Internal Server Error',
      );
    }
  }

  async getUserDetails(userId: string) {
    try {
      const res = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
       
      });

      const orderCount = await this.prisma.order.groupBy({
        by: 'orderId',
        _count:{
          orderId:true
        }
      });
      if (res) {
        return {
          statusCode: 200,
          message: 'User Details Fetched Successfully.',
          data: {...res,orderCount:orderCount?.length},
        };
      } else {
        throw new BadRequestException('User Does Not Exists');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Internal Server Error',
      );
    }
  }
}
