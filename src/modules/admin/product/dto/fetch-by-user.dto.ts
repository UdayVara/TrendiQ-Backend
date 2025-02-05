import {IsOptional, IsString } from 'class-validator';

export class FetchForUser {
  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  categoryId: string;

  @IsOptional()
  // @IsEnum(gender)  
  gender: string;

  @IsString()
  page: number;

  @IsString()
  size: number;
}
