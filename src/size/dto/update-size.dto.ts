import { PartialType } from '@nestjs/swagger';
import { CreateSizeDto } from './create-size.dto';
import { IsString } from 'class-validator';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {
  @IsString()
  sizeId: string;
}
