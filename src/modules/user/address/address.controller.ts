import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';

@Controller('address')
@UseGuards(AuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto,@Request() req : any) {
    return this.addressService.create(createAddressDto,req.user.id);
  }

  @Patch("/default/:id")
  updateDefault(@Param('id') id: string,@Request() req : any) {
    return this.addressService.updateDefault(id,req.user.id);
  }

  @Get()
  findAll(@Request() req : any) {
    return this.addressService.findAll(req.user.id);
  }

 

  @Patch()
  update(@Body() updateAddressDto: UpdateAddressDto,@Request() req : any) {
    return this.addressService.update(updateAddressDto,req.user.id);
  }

  @Delete(":id")
  remove(@Param('id') id: string,@Request() req : any) {
    return this.addressService.remove(id,req.user.id);
  }
}
