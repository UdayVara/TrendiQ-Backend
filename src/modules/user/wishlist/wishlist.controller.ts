import { Body, Controller ,Delete,Get,Param,Post,Request, UseGuards} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddWishlistDto } from './dto/addWishlist.dto';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';

@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()

  async addWishlist(@Body() addWishlistDto: AddWishlistDto,@Request() req:any) {
    return this.wishlistService.addWishlist(addWishlistDto,req.user.id);
  }


  @Get()
  async getWishlist(@Request() req:any) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  @Delete(':id')
  async deleteWishlist(@Param('id') id: string,@Request() req:any) {
    return this.wishlistService.deleteWishlist(id,req.user.id);
  }
}
