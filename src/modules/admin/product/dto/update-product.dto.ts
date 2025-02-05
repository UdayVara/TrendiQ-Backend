
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { gender } from '@prisma/client';

export class UpdateProductDto  {
  @IsString()
  @IsUUID()
  productId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
  
  @IsOptional()
  @IsString()
  markupDescription?: string;

  @IsUUID()
  @IsString()
  categoryId: string;

  @IsEnum(gender)
  gender: string;

  @IsString()
  isTrending: string;

  @IsString()
  color: string;
}
