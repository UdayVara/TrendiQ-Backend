import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class getProductDto {
    @IsString()
    @ApiProperty({type:"number",example:"1",description:"Page number"})
    page: string;

    @IsString()
    @ApiProperty({type:"number",example:"10",description:"Number of items per page"})
    size:string;

    @IsString()
    @IsOptional()
    @ApiProperty({type:"string",description:"Search Keyword",required:false})
    search:string

    @IsOptional()
    @IsString()
    @ApiProperty({type:"category",example:"99is-sjjj-ssss-wwww",description:"Category Id",required:false})
    categoryId:string;

    @IsString()
    @IsOptional()
    @ApiProperty({type:"gender",example:"male",description:"male or female",required:false})
    gender:string;

    @IsOptional()
    @ApiProperty({type:"email",example:"PjG2z@example.com",description:"User Email for Wishlist ",required:false})
    userEmail:string;
}