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
import {CategoryModule as UserCategoryModule} from "./modules/user/category/category.module"
import { BannerModule } from './modules/admin/banner/banner.module';
import { SupportModule } from './modules/shared/support/support.module';
import { OrderModule } from './modules/admin/order/order.module';
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
    UserCategoryModule,
    BannerModule,
    SupportModule,
    OrderModule,
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
          {
            path: '/',
            module: CategoryModule,
          },
          {
            path: '/',
            module: BannerModule,
          },
          {
            path: '/',
            module: OrderModule,
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
          },
          {
            path:"/",
            module:UserCategoryModule
          },
          {
            path:"/",
            module:SupportModule
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
