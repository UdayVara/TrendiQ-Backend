import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ConfigsService } from './configs.service';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Post()
  async getConfigs(@Body("pass") pass:string ) {
    if(!pass || pass == ""){
      throw new UnauthorizedException();
    }

    if(pass == process.env.key_pass){
      return this.configsService.getConfigs();
    }
  }
}
