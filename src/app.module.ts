import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/shared/auth/auth.module';
import { EnviromentModule } from './modules/admin/enviroment/enviroment.module';
import { CategoryModule } from './modules/admin/category/category.module';
import { SizeModule } from './modules/admin/size/size.module';
import { ProductModule } from './modules/admin/product/product.module';
import { CartModule } from './modules/user/cart/cart.module';
import { RouterModule } from '@nestjs/core';
import {UserProductModule} from  "./modules/user/product/product.module"
import { AddressModule } from './modules/user/address/address.module';
import { StripeModule } from './modules/user/stripe/stripe.module';
import { WishlistModule } from './modules/user/wishlist/wishlist.module';
@Module({
  imports: [
    CommonModule,
    AuthModule,
    CategoryModule,
    SizeModule,
    ProductModule,
    CartModule,
    UserProductModule,
    AddressModule,
    StripeModule,
    WishlistModule,
    RouterModule.register([
      {
        path: 'admin',
        children: [
          {
            path: '/',
            module: EnviromentModule,
          },
          {
            path: '/',
            module: CategoryModule,
          },
          {
            path: '/',
            module: SizeModule,
          },
          {
            path: '/',
            module: ProductModule,
          },
        ],
      },
      {
        path:"user",
        children:[
          {
            path:"/",
            module:UserProductModule
          },
          {
            path:"/",
            module:CartModule
          },
          {
            path:"/",
            module:AddressModule
          },
          {
            path:"/",
            module:StripeModule
          },
          {
            path:"/",
            module:WishlistModule
          }
        ]
      }
    ]),
   
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [CommonModule],
})
export class AppModule {}
